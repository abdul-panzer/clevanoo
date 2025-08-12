<?php
function handleContactForm() {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        return json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }

    $secretKey = "6LcFN6QrAAAAAMFTBxJDIdV8mUlhW2GV3VdjVEkw"; // Replace with your secret key
    $captcha = $_POST['g-recaptcha-response'] ?? '';

    // Verify reCAPTCHA
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha");
    $responseKeys = json_decode($response, true);

    if (intval($responseKeys["success"]) !== 1) {
        return json_encode(['status' => 'error', 'message' => 'CAPTCHA verification failed.']);
    }

    $name = strip_tags(trim($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST['message'] ?? '');

    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        return json_encode(['status' => 'error', 'message' => 'Please complete all fields correctly.']);
    }

    $to = "info@clevanoollc.com";
    $subject = "New contact form message from $name";
    $headers = "From: info@clevanoollc.com\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8";

    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    if (mail($to, $subject, $body, $headers)) {
        return json_encode(['status' => 'success', 'message' => 'Message sent successfully!']);
    } else {
        return json_encode(['status' => 'error', 'message' => 'Failed to send message.']);
    }
}

// Output the response
header('Content-Type: application/json');
handleContactForm();
