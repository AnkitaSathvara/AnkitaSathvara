<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    $myCompanyName = "CompanyName";
    $myCompanyEmail = "ankitasathvara9@gmail.com";
    $myCompanyEmailPassword = "kishu@27994";
    
    $myPersonalEmail = "ankitasathvara3006@gmail.com";

    require 'contact_us/phpmailer/src/Exception.php';
    require 'contact_us/phpmailer/src/PHPMailer.php';
    require 'contact_us/phpmailer/src/SMTP.php';

    if(isset($_POST['submit'])) {

        $mail = new PHPMailer(true);

        //$mail->SMTPDebug = 0;

        $mail->Host = 'smtp.mboxhosting.com';
        $mail->SMTPAuth = true;
        $mail->Username = $myCompanyEmail;
        $mail->Password = $myCompanyEmailPassword;
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom($myCompanyEmail, $myCompanyName);
        $mail->addAddress($myPersonalEmail);
        $mail->addReplyTo($_POST['email'], $_POST['name']);

        $mail->isHTML(true);
        $mail->Subject = 'My Subject';
        $mail->Body = $_POST['message'];

        try {
            $mail->send();
            echo 'Your message was sent successfully!';
        } catch (Exception $e) {
            echo "Your message could not be sent! PHPMailer Error: {$mail->ErrorInfo}";
        }
        
    } else {
        echo "There is a problem with the document!";
    }
    
?>