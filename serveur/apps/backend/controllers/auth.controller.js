import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import JWT from "jsonwebtoken";
import { supabase } from "../../../packages/db/supabase.js";
import { sendVerificationEmail } from "../utils/email.js";
import crypto from "crypto";

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const signToken = (payload) => {
  return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return JWT.verify(token, process.env.JWT_SECRET);
};

export const Login = async (req, res, next) => {
  // verfier si l'utilisateur existe dans la base de donnees
  const {
    data: [user],
    error,
  } = await supabase.from("users").select("*").eq("email", req.body.email);

  if (error) {
    throw new ApiError(500, "Internal server error");
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!comparePassword(req.body.password, user.password_hash)) {
    throw new ApiError(401, "Invalid password");
  }

  if (!user.is_verified) {
    throw new ApiError(403, "Email not verified. Please check your email.");
  }

  const accessToken = signToken({ userId: user.id });

  res.status(200).json({
    user: { id: user.id, email: user.email, username: user.username },
    accessToken,
  });
};

export const Register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // 1. Email existe déjà ?
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = "no rows found" → normal, pas une vraie erreur
      throw new ApiError(500, "Erreur serveur");
    }

    if (existingUser) throw new ApiError(409, "Email déjà utilisé");

    // 2. Hasher le password
    const hashedPassword = await hashPassword(password);

    // 3. Créer l'utilisateur
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ email, username, password_hash: hashedPassword }])
      .select("id, email, username") // ← obligatoire pour récupérer l'id
      .single();

    if (insertError || !newUser) throw new ApiError(500, "Erreur lors de la création du compte");

    // 4. Générer le token de vérification
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // 5. Sauvegarder le token
    const { error: tokenError } = await supabase
      .from("email_verifications")
      .insert([{ user_id: newUser.id, token, expires_at: expiresAt }]);

    if (tokenError) throw new ApiError(500, "Erreur lors de la création du token");

    // 6. Envoyer l'email
    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({
      message: "Compte créé. Vérifie ton email pour activer ton compte.",
    });

  } catch (err) {
    next(err);
  }
};

export const VerifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) throw new ApiError(400, "Token manquant");

    // 1. Chercher le token
    const { data: tokenData, error: tokenError } = await supabase
      .from("email_verifications")
      .select("user_id, expires_at")
      .eq("token", token)
      .single();

    // 2. Vérifier tokenError ET tokenData séparément
    if (tokenError || !tokenData) throw new ApiError(400, "Token invalide");

    // 3. Token expiré → supprimer PUIS throw
    if (new Date(tokenData.expires_at) < new Date()) {
      await supabase.from("email_verifications").delete().eq("token", token);

      throw new ApiError(400, "Token expiré, demande un nouveau lien");
    }

    // 4. Activer le compte
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("id", tokenData.user_id);

    if (updateError) throw new ApiError(500, updateError.message || "Erreur lors de l'activation du compte");

    // 5. Supprimer le token — usage unique
    await supabase.from("email_verifications").delete().eq("token", token);

    res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (err) {
    next(err);
  }
};
