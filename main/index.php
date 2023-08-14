<?php
$data = null;

if (strtolower($_SERVER['CONTENT_TYPE'] ?? '') === 'application/json') {

       $data =  json_decode(file_get_contents('php://input'), true);

}else{
       $data = $_POST;
}

 header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Application-Mode, authorization, sid,  Application-Id");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Allow: GET, POST, OPTIONS, PUT, DELETE");
        header('mode: init');

       // header('Content-Type: application/json; charset=utf-8');

        //return json_encode($this->getResponse(), JSON_PRETTY_PRINT);
        sleep(3);
        echo json_encode($data);
