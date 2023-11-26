<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Include necessary PHPMailer files
require '../PHPMailer/Exception.php';
require '../PHPMailer/PHPMailer.php';
require '../PHPMailer/SMTP.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $response = array();
    $mail = new PHPMailer(true);

    try {
        //$mail->SMTPDebug = SMTP::DEBUG_SERVER; 
        // Configure your mail server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'ankitasathvara3006@gmail.com';
        $mail->Password = 'cknp yayb zyoe dqzd';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Get form data
        $senderName = $_POST['name'];
        $senderEmail = $_POST['email'];
        $message = $_POST['message'];
        $subject = $_POST['subject'];

        // Set recipients and mail content
        $mail->setFrom('ankitasathvara3006@gmail.com', 'Form');
        $mail->addAddress('ankitasathvara9@gmail.com', 'Website');
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = "Sender Name: $senderName <br> Sender Email: $senderEmail <br> Subject: $subject <br> Message: $message";

        // Send mail
        $mail->send();
     
         // Set success response
         
         echo 'Your message has been sent. Thank you!';
         
     } catch (Exception $e) {
         // Set error response
        echo 'Message could not be sent. Please try again later.';
     }
 
   

}
?>
