<?php
/**
 * Created by PhpStorm.
 * User: Stand Alone Complex
 * Date: 2018/4/20
 * Time: 14:13
 */
//the parameters that used for connecting to database.
$servername = "localhost";
$dbusername = "root";
$password = "";
$dbname = "jobster";

//create new connection and check if it is connected successfully.
$conn = new mysqli($servername, $dbusername, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(array('message' => "Connection failed: " . $conn->connect_error)));
}

//get parameters from frontend.
$semail = $_POST['semail'];
$sgpa = $_POST['sgpa'];
$sphone = $_POST['sphone'];
$suniversity = $_POST['university'];
$smajor = $_POST['smajor'];
$sresume = $_POST['sresume'];
$sprivacy = $_POST['sprivacy'];
//prevent xss attack
$semail = htmlspecialchars($semail, ENT_QUOTES);
$sgpa = htmlspecialchars($sgpa, ENT_QUOTES);
$sphone = htmlspecialchars($sphone, ENT_QUOTES);
$suniversity = htmlspecialchars($suniversity, ENT_QUOTES);
$smajor = htmlspecialchars($smajor, ENT_QUOTES);
$sresume = htmlspecialchars($sresume, ENT_QUOTES);
$sprivacy = htmlspecialchars($sprivacy, ENT_QUOTES);
//initialize response to frontend.
$response = array();

//update personal information to backend database.
$sql_update_personal_info = "update student set sgpa = ?, sphone = ?, suniversity = ?, 
smajor = ?, sresume = ?, sprivacy = ? where semail = ?;";
$update_personal_info = $conn->prepare($sql_update_personal_info);
$update_personal_info->bind_param('sssssss',$sgpa, $sphone, $suniversity, $smajor, $sresume,
    $sprivacy, $semail);
if ($update_personal_info->execute()){
    $response['update_personal_info'] = "Student user ".$semail.": Profile updated successfully!";
}
else{
    $response = "ERROR: ".$update."<br>".$conn->error;
}
echo json_encode($response);
$conn->close();
?>