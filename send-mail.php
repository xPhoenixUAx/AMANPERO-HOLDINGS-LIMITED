<?php
declare(strict_types=1);

function clean_input(string $value): string
{
    return trim(filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'This endpoint accepts POST requests only.';
    exit;
}

$honeypot = $_POST['website'] ?? '';
if (trim((string) $honeypot) !== '') {
    http_response_code(400);
    echo 'Submission could not be processed.';
    exit;
}

$fields = [
    'name' => clean_input((string) ($_POST['name'] ?? '')),
    'email' => trim((string) ($_POST['email'] ?? '')),
    'company' => clean_input((string) ($_POST['company'] ?? '')),
    'service_interest' => clean_input((string) ($_POST['service_interest'] ?? '')),
    'budget_range' => clean_input((string) ($_POST['budget_range'] ?? '')),
    'project_timeline' => clean_input((string) ($_POST['project_timeline'] ?? '')),
    'project_details' => clean_input((string) ($_POST['project_details'] ?? '')),
    'consent' => isset($_POST['consent']) ? 'Yes' : '',
];

$required = ['name', 'email', 'service_interest', 'project_details', 'consent'];
foreach ($required as $key) {
    if ($fields[$key] === '') {
        http_response_code(422);
        echo 'Please complete all required fields.';
        exit;
    }
}

if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo 'Please enter a valid email address.';
    exit;
}

$to = 'support@amanperoagency.com';
$subject = 'New project inquiry from Amanpero Agency website';
$submittedAt = date('Y-m-d H:i:s T');

$message = "New project inquiry submitted via amanperoagency.com\n\n";
$message .= "Submitted at: {$submittedAt}\n";
$message .= "Name: {$fields['name']}\n";
$message .= "Email: {$fields['email']}\n";
$message .= "Company: {$fields['company']}\n";
$message .= "Service interest: {$fields['service_interest']}\n";
$message .= "Budget range: {$fields['budget_range']}\n";
$message .= "Project timeline: {$fields['project_timeline']}\n\n";
$message .= "Project details:\n{$fields['project_details']}\n\n";
$message .= "Consent: {$fields['consent']}\n";

$headers = [
    'From: Amanpero Agency Website <support@amanperoagency.com>',
    'Reply-To: ' . $fields['name'] . ' <' . $fields['email'] . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $message, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo 'Your message could not be sent right now. Please email support@amanperoagency.com.';
    exit;
}

echo 'Thank you. Your project inquiry has been sent to Amanpero Agency.';
