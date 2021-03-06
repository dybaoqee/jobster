<?php
/**
 * Created by PhpStorm.
 * User: Stand Alone Complex
 * Date: 2018/4/17
 * Time: 20:37
 */
// import the classes used in this file
require("../../entity/classes.php");
$objectStudentInfo = new personal_info();
$objectRestrictedStudentInfo = new student_info_restircted();

require ("../../entity/class.pdf2text.php.php");
$PDF_reader = new PDF2Text();

//the parameters that used for connecting to database.
$servername = "localhost";
$dbusername = "root";
$password = "root";
$dbname = "jobster";

//create new connection and check if it is connected successfully.
$conn = new mysqli($servername, $dbusername, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(array('message' => "Connection failed: " . $conn->connect_error)));
}
//initialize return variable.
$response = array();
$temp_array = array();

//get parameters from frontend
//$keyword = $_POST['keyword'];
//$sgpalower = $_POST['sgpalower'];
//$sgpahigh = $_POST['sgpahigh'];

//$keyword = 'java';$_POST['keyword'];
//$sgpalower = 3;$_POST['sgpalower'];
//$sgpahigh = 4;$_POST['sgpahigh'];
$cname = $_POST['cname'];
$keyword = $_POST['keyword'];
$sgpalower = $_POST['sgpalower'];
$sgpahigh = $_POST['sgpahigh'];
//prevent injection and xss attack.

$keyword = $conn->real_escape_string($keyword);
$sgpahigh = $conn->real_escape_string($sgpahigh);
$sgpalower = $conn->real_escape_string($sgpalower);

$cname = htmlspecialchars($cname, ENT_QUOTES);
$keyword = htmlspecialchars($keyword, ENT_QUOTES);
$sgpahigh = htmlspecialchars($sgpahigh, ENT_QUOTES);
$sgpalower = htmlspecialchars($sgpalower, ENT_QUOTES);


//get token
$token = $_POST["token"];
//verify the token
require("../../entity/JWT.php");
$object_JWT = new JWT();
if (!$object_JWT->token_verify($token, $cname)){
    header('HTTP/1.0 401 Unauthorized');
    die ("Your token is not matched with your username");
}


//query resume that fit the keyword

$sql_resume_path = "select * from Student;";
$result_resume_path = mysqli_query($conn, $sql_resume_path);
if ($result_resume_path->num_rows > 0) {
    // echo "!!!"."<br>";
    while ($row = $result_resume_path->fetch_assoc()) {
        $PDF_reader->setFilename($row['sresume']);
        $PDF_reader->decodePDF();
        if (strpos($PDF_reader->output(), $keyword)
            or (strstr($row['suniversity'],$keyword))
            or (strstr($row['smajor'], $keyword))
            or (($row['sgpa']<=$sgpahigh)
                and ($row['sgpa']>=$sgpalower)))
        {
            if ($row['sprivacy'] == False) {
                $info = $objectStudentInfo->Build_personal_Info($row);
                array_push($response, $info);
                //            $response[$row['semail']] = $info;
            }
            else{
                $info = $objectRestrictedStudentInfo->Build_student_info_restricted($row);
                array_push($response, $info);
            }
        }
    }
}
else {
    // header('HTTP/1.0 403 Forbidden');
    $response['error'] = "No result fits your keyword.";
}


echo json_encode($response);

$conn->close();
?>