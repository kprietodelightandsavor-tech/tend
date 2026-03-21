// netlify/functions/check-pending-upgrade.js
//
// Called right after a new user signs up.
// Checks if they paid on Gumroad before creating their account,
// and if so, immediately grants them Premium.

const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { email, userId } = JSON.parse(event.body);
    if (!email || !userId) {
      return { statusCode: 400, body: "Missing email or userId" };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Check if there's a pending upgrade for this email
    const { data, error } = await supabase
      .from("pending_upgrades")
      .select("is_paid")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !data?.is_paid) {
      return { statusCode: 200, body: JSON.stringify({ isPaid: false }) };
    }

    // Grant Premium
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { is_paid: true }
    });

    // Clean up pending record
    await supabase.from("pending_upgrades").delete().eq("email", email.toLowerCase());

    return { statusCode: 200, body: JSON.stringify({ isPaid: true }) };

  } catch (err) {
    console.error("Check upgrade error:", err);
    return { statusCode: 500, body: "Internal error" };
  }
};
