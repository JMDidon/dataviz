<?php
$site = include 'core/r76.php';
$site->config('core/CONFIG');
$site->run(function() { go(root()); }); 