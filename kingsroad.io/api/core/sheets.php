<?php
class sheets {
  private static $sheets = array();
  
  function set($key, $url) { self::$sheets[$key] = $url; }
  function get($key) { return self::$sheets[$key]; }
  function getAll() { return self::$sheets; }
  
  function save($key) { file_put_contents(cache.$key, serialize(self::csvToArray(self::get($key))), LOCK_EX); }
  function load($key) { return unserialize(file_get_contents(cache.$key)); }
  
  private function csvToArray($file, $delimiter = ',') {
    if (($handle = fopen($file, 'r')) !== FALSE) { 
      $i = 0; 
      while (($lineArr = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
        if ($i == 0) $keys = $lineArr;
        else $arr[] = array_combine($keys, (array)$lineArr);
        $i++; 
      } 
      fclose($handle);
    }
    return (array)$arr;
  }
}