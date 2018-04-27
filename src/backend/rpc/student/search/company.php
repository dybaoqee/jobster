<?php
/**
 * Created by PhpStorm.
 * User: Stand Alone Complex
 * Date: 2018/4/12
 * Time: 20:58
 */
// import the classes used in this file
require("../../../entity/classes.php");
$objectCompanyInfo = new company_info();

//get parameter from frontend.
$keyword = $_POST['keyword'];
//initialize response to frontend.
$response = array();

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
//search companies that fit the keywords from backend database.
$sql_company_search = "select * from  Company where (cname LIKE '%$keyword%') or (clocation like '%$keyword%') or 
(cindustry like '%$keyword%') or (cemail like '%$keyword%') or (cphone like '%$keyword%') or (cdescription like '%$keyword%') ;";
$result_company_search = mysqli_query($conn, $sql_company_search);

if  ($result_company_search->num_rows > 0){
    while ($row = $result_company_search->fetch_assoc()){
        $info = $objectCompanyInfo->Build_Company_Info($row);
        array_push($response, $info);
    }
    echo json_encode($response);
}
else{
    header('HTTP/1.0 403 Forbidden');
    die('Cannot find company fits your keyword:'.$keyword);
}
$conn->close();
?>