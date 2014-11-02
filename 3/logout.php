<?php
session_start();
unset($_SESSION['SESS_FIRST_NAME']);
unset($_SESSION['SESS_LAST_NAME']);
unset($_SESSION['SESS_EMAIL']);
session_destroy();
?>

<html>
<body>
<script>
window.location.assign("./index.php");
</script>
</body>
</html>