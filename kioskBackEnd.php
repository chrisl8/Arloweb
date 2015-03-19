<?php
#header('Content-Type: application/json');
$quietFile = "/home/chrisl8/.arlobot/status/bequiet";
$stopFile = "/home/chrisl8/.arlobot/status/webStopRequested";
if (isset($_POST["PLEASE"])) {
    if ( $_POST["PLEASE"] === 'beQuiet') {
        $myfile = fopen($quietFile, "w") or die("Unable to open file!");
        $txt = "quiet\n";
        fwrite($myfile, $txt);
        fclose($myfile);
        chmod($quietFile, 0666);
    } elseif ( $_POST["PLEASE"] === 'talk') {
        unlink($quietFile);
    } elseif ( $_POST["PLEASE"] === 'stop') {
        $myfile = fopen($stopFile, "w") or die("Unable to open file!");
        $txt = "STOP\n";
        fwrite($myfile, $txt);
        fclose($myfile);
        chmod($stopFile, 0666);
    } elseif ( $_POST["PLEASE"] === 'go') {
        unlink($stopFile);
    }
}
$amQuiet = (file_exists($quietFile)) ? 'true' : 'false';
$amStopped = (file_exists($stopFile)) ? 'true' : 'false';
echo("{ \"QUIET\": $amQuiet, \"STOP\": $amStopped }");
?>
