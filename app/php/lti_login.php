<?php
session_start();
class UserInfo {
    var $login_error = "NONE";
    var $course_id;
    var $priv_level = 1;
}
$res = new UserInfo();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['course_id'])) {
    $priv_level = $_SESSION['priv_level'];
    $res->priv_level = $priv_level;
    $course_id = $_SESSION['course_id'];
    $res->course_id = $course_id;
    echo json_encode($res);
} else {
    $res->login_error = "Authentication error.";
    echo json_encode($res);
}

?>