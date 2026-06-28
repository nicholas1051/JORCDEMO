<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$apiKey = getenv("RESEND_API_KEY");
if (!$apiKey) {
    // Fallback: read from a config file (place outside public_html for security)
    $config = __DIR__ . "/../config.php";
    if (file_exists($config)) {
        $apiKey = include $config;
    }
}
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(["error" => "RESEND_API_KEY not configured"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$formType = $input["formType"] ?? "";
$data = $input["data"] ?? [];

$fields = "";
foreach ($data as $k => $v) {
    $v = htmlspecialchars($v ?: "-");
    $fields .= "<tr><td style=\"font-weight:600;padding:6px 12px;border-bottom:1px solid #e5e7eb;white-space:nowrap\">$k</td><td style=\"padding:6px 12px;border-bottom:1px solid #e5e7eb\">$v</td></tr>";
}

$titles = [
    "contact" => "New Contact Form Submission",
    "facility" => "New Facility Booking Request",
    "programs" => "New Program Registration",
];

$subject = $titles[$formType] ?? "New " . ucfirst($formType) . " Submission";
$html = "
<div style=\"font-family:system-ui,sans-serif;max-width:600px;margin:0 auto\">
  <div style=\"background:#1A472A;padding:24px;text-align:center\">
    <h1 style=\"color:#FFCE1B;margin:0;font-size:20px\">JONAH OTUNLA RESOURCE CENTER</h1>
  </div>
  <div style=\"padding:24px\">
    <h2 style=\"color:#1A472A;margin:0 0 16px\">$subject</h2>
    <table style=\"width:100%;border-collapse:collapse\">$fields</table>
    <p style=\"color:#6b7280;font-size:12px;margin-top:24px\">Sent from jorcenter.org</p>
  </div>
</div>";

$ch = curl_init("https://api.resend.com/emails");
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $apiKey",
        "Content-Type: application/json",
    ],
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        "from" => "JORC Website <onboarding@resend.dev>",
        "to" => "superdeeeeajibola@gmail.com",
        "subject" => $subject,
        "html" => $html,
    ]),
    CURLOPT_RETURNTRANSFER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send email", "detail" => $response]);
}
