// netlify/functions/gumroad-webhook.js
//
// Receives Gumroad purchase webhooks and sets is_paid = true
// in Supabase user metadata.

const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    // Parse Gumroad's URL-encoded form payload
    const params   = new URLSearchParams(event.body);
    const email    = params.get("email");
    const refunded = params.get("refunded") === "true";
    const sellerId = params.get("seller_id");

    if (!email) {
      return { statusCode: 400, body: "No email in payload" };
    }

    // Verify the ping is from your Gumroad account
    const EXPECTED = process.env.GUMROAD_SELLER_ID;
    if (EXPECTED && sellerId !== EXPECTED) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    // Connect to Supabase with the service role key (has admin write access)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Find the user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // They paid but haven't signed up yet — store so we can grant on signup
      await supabase.from("pending_upgrades").upsert({
        email: email.toLowerCase(),
        is_paid: !refunded,
        purchased_at: new Date().toISOString(),
      });
      console.log(`Pending upgrade stored for ${email}`);
      return { statusCode: 200, body: "Pending upgrade recorded" };
    }

    // Grant or revoke Premium
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, is_paid: !refunded } }
    );
    if (updateError) throw updateError;

    console.log(`Premium ${refunded ? "revoked" : "granted"} for ${email}`);
    return { statusCode: 200, body: "OK" };

  } catch (err) {
    console.error("Webhook error:", err);
    return { statusCode: 500, body: "Internal error" };
  }
};
