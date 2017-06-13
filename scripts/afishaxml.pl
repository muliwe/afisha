#!/usr/local/bin/perl

#use strict; 
#use warnings;
use Data::Dumper;
use XML::Simple;
#use Encode 'from_to';
use Encode;
use DBI;
use LWP::UserAgent;
use Scalar::Util qw/reftype/;

require '/home/u12939/kinokadr.ru/cgi-bin/admin/suxx.req';

my $apikey = "3ca843cc-79e6-49ec-85eb-8653b83f438a";

my %city = (
'msk' => '2',
'spb' => '3',
#'kiev' => '689',
'ekaterinburg' => '5',
'novosibirsk' => '9',
'nnovgorod' => '8',
'ufa' => '15',
'kazan' => '339',
'chelyabinsk' => '16',
'volgograd' => '4',
'samara' => '12',
'krasnodar' => '338',
'rostov-na-donu' => '11',
'volgograd' => '4',
'voronezh' => '2010',
'omsk' => '2487',
'krasnoyarsk' => '2386',
'perm' => '340',
);

my %city2 = ();

foreach my $city (keys %city)
{
$city2{$city{$city}} = $city;
}

my %conf_lang=
  (
  'sci-fi' => 'Фантастика',
  'action' => 'Экшн',
  'drama' => 'Драма',
  'kids' => 'Фильм-детям',
  'humor' => 'Комедии',
  'romance' => 'Мелодрама',
  'disaster' => 'Фильм-катастрофа',
  'fantasy' => 'Фильм-фантазия',
  'adventure' => 'Приключения и фэнтэзи',
  'detective' => 'Детектив',
  'documentary' => 'Документальное кино',
  'horror' => 'Ужас!',
  'peplum' => 'Исторический',
  'comics' => 'Кино-комикс',
  'musical' => 'Мюзикл',
  'military' => 'Война',
  'sport' => 'Спорт',
  'crime' => 'Криминальное',
  'serials' => 'Сериалы',
  
#  '' => '',
  );

my $ymd = sub{sprintf '%04d-%02d-%02d',
    $_[5]+1900, $_[4]+1, $_[3]}->(localtime);

my $time_on = time();
my $t0 = [(time, times, 0)];

umask 002;

my $connected = 0;
my $dbh;

chdir('/home/u12939/kinokadr.ru/kinosupport/afisha/');

`/bin/rm *.xml`;

my %xml = (
"cities.xml" => "http://api.kassa.rambler.ru/v2/$apikey/xml/Movie/export/full/fullmovie-cities1.xml",
"index.xml" => "http://api.kassa.rambler.ru/v2/$apikey/xml/Movie/export/full/"
);

foreach my $file (sort keys %xml)
{
&wget_url($file,$xml{$file});
};

my $xs = new XML::Simple();

my $ref = $xs->XMLin("index.xml");

#print Dumper($ref);

my @types = ('Places','Creations','Sessions');

foreach my $type (@types) 
{
`/bin/rm $type/*.xml` if ($type ne 'Sessions');

foreach my $file (@{$ref->{$type}->{Files}->{File}})
{
#print Dumper($file);
my $file2 = $type ."/". $file->{filename};
$xml{$file2} = "http://api.kassa.rambler.ru/v2/$apikey/xml/Movie/export/full/". $file->{filename};
&wget_url($file2,$xml{$file2}) if ($type ne 'Sessions');
};
};

open(JSON,">rambler.json.tmp");

my $ref3 = $xs->XMLin("cities.xml");

my $cities = '';

foreach my $city (@{$ref3->{City}})
{
my $name = $city->{Name};
$name =~ s/\"/\\\"/g;

my $id = $city->{CityID};
my $latitude = $city->{Latitude}/1;
my $longitude = $city->{Longitude}/1;

$cities .= <<EOF;
{"id":$id,"title":"$name","latitude":$latitude,"longitude":$longitude},
EOF
}

Encode::_utf8_off($cities);
$cities =~ s/\,\s*$//s;

print JSON <<EOF;
{
"updated": "$ymd",
"cities": [
$cities
],
"films": [
EOF

my $i = 0;
my $films = '';

#my @data;
#my $err = &dataselect("delete from ramblerfilms", \@data, \$connected, \$dbh);

foreach my $file (sort keys %xml)
{
#last;
next unless ($file =~ /^Creations/);
print "$file \n";

my $ref2 = $xs->XMLin("$file");

#print Dumper($ref2);
#exit(0);

foreach my $film (@{$ref2->{Creation}})
{

#next if ($film->{ObjectID}/1 ne 55043);

my $name = $film->{Name};
$name =~ s/\'/\\\'/g;
Encode::_utf8_off($name);
Encode::from_to($name, "utf-8", "windows-1251");
#encode("cp1251", $name);

my $id = $film->{ObjectID};
my $age = (reftype $film->{AgeRestriction} ne reftype '' ? 0 : $film->{AgeRestriction});
my $shows = $film->{ViewCountDaily}/1;
my $poster = (reftype $film->{Thumbnail} ne reftype '' ? '' : $film->{Thumbnail});

my @data2;
my $err = &dataselect("select r.id, f.anons, f.theme from ramblerfilms as r join afisha as a on r.ramblerid = a.ramblerid join films as f on f.filmid = a.id where r.ramblerid = $id", \@data2, \$connected, \$dbh);

${$data2[0]}[1] =~ s/\"/\\\"/g;
${$data2[0]}[1] =~ s/\n/\\n/g;

my $anons = ${$data2[0]}[1] ? "\"${$data2[0]}[1]\"" : 'null';
$anons =~ s!href=\\"/!href=\\"http://www.kinokadr.ru/!g;

my $theme = $conf_lang{${$data2[0]}[2]} ? "\"$conf_lang{${$data2[0]}[2]}\"" : 'null';

my $insert ;

if (!${$data2[0]}[0]) {
$insert = "insert into ramblerfilms (ramblerid, title, shows, age, poster) values ($id, '$name', $shows, $age, '$poster')";
} else {
$insert = "update ramblerfilms set title = '$name', shows = $shows, age = $age, poster = '$poster' where ramblerid = $id";
};

$name =~ s/\\\'/\'/g;
$name =~ s/\"/\\\"/g;

my $file = "posters/". $id ."poster.jpg";
$file =~ s/\/(\d\d)/\/$1\//;
my $thumb = $file;
$thumb =~ s/\.jpg/_thumb\.jpg/;

print "$poster -> $file ($thumb) ";
$poster = "\"http://pics.kinokadr.ru/$file\",\"thumb\":\"http://pics.kinokadr.ru/$thumb\"";

if (-s $file) {
  print " CACHE\n";
} else {
  &wget_url($file,$poster);
  if (-s $file) {
    `/usr/bin/convert $file -resize 200 -quality 70 $thumb`;
    print " OK\n";
  } else {
    $poster = "null,\"thumb\":null";
    print " ERROR\n";
  }
}

my $filmstr = <<EOF;
{"id":$id,"title":"$name","age":"$age","shows":$shows,"poster":$poster,"anons":$anons,"theme":$theme},
EOF

print $filmstr;

Encode::from_to($filmstr, "windows-1251", "utf-8");

print $filmstr;

$films .= $filmstr;

#Encode::_utf8_off($insert);
#Encode::from_to($insert, "utf-8", "windows-1251");
print $i++ ."$id: $insert;\n";

my @data3;
my $err = &dataselect($insert, \@data3, \$connected, \$dbh);

};
};

$films =~ s/\,\s*$//s;
Encode::_utf8_off($films);

print JSON <<EOF;
$films
],
"cinemas": [
EOF


$i = 0;
my $cinemas = '';

my @data;
my $err = &dataselect("delete from ramblercinemas", \@data, \$connected, \$dbh);

foreach my $file (sort keys %xml)
{
next unless ($file =~ /^Places/);
print "$file \n";

my $ref2 = $xs->XMLin("$file");

#print Dumper($ref2);
#exit(0);

foreach my $cinema (@{$ref2->{Place}})
{

my $city = $cinema->{CityID}/1;
#next unless ($city2{$city});

my $name = $cinema->{Name};
$name =~ s/\'/\\\'/g;
#Encode::_utf8_off($name);
#Encode::from_to($name, "utf-8", "windows-1251");
#encode("cp1251", $name);

my $address = $cinema->{Address};
$address =~ s/\'/\\\'/g;
$address =~ s/[r\n]+/ /g;

#Encode::_utf8_off($address);
#Encode::from_to($address, "utf-8", "windows-1251");

my $id = $cinema->{ObjectID};
my $rate = (reftype $cinema->{Rate} ne reftype '' ? 0 : $cinema->{Rate});
my $latitude = $cinema->{Latitude}/1;
my $longitude = $cinema->{Longitude}/1;

my $metro = (reftype $cinema->{Metro} ne reftype '' ? '' : $cinema->{Metro});
#Encode::_utf8_off($metro);
#Encode::from_to($metro, "utf-8", "windows-1251");

my @data3;
my $err = &dataselect("select id from ramblercinemas where ramblerid = $id", \@data3, \$connected, \$dbh);

my $insert;

if (${$data3[0]}[0]) {
$insert = "update ramblercinemas set title = '$name', address = '$address', latitude = $latitude, longitude = $longitude, metro = '$metro', rate = $rate, city = $city where ramblerid = $id";
} else {
$insert = "insert into ramblercinemas (ramblerid, title, address, latitude, longitude, metro, rate, city) values ($id, '$name', '$address', $latitude, $longitude, '$metro', $rate, $city)";
};

$name =~ s/\\\'/\'/g;
$name =~ s/\"/\\\"/g;
$address =~ s/\\\'/\'/g;
$address =~ s/\"/\\\"/g;

$cinemas .= <<EOF;
{"id":$id,"title":"$name","address":"$address","latitude":$latitude,"longitude":$longitude,"metro":"$metro","rate":$rate,"city":$city},
EOF

Encode::_utf8_off($insert);
Encode::from_to($insert, "utf-8", "windows-1251");
#print $i++ ." $id: $insert;\n";

my @data2;
my $err = &dataselect($insert, \@data2, \$connected, \$dbh);

};
};

Encode::_utf8_off($cinemas);
$cinemas =~ s/\,\s*$//s;

print JSON <<EOF;
$cinemas
],
"shows": [
EOF


$i = 0;
my $shows = '';

foreach my $file (sort keys %xml)
{
next unless ($file =~ /^Sessions/);
print "$file \n";

my $ref2 = $xs->XMLin("$file");

#print Dumper($ref2);
#exit(0);

foreach my $session (@{$ref2->{Session}})
{

my $id = $session->{SessionID}/1;
my $film = $session->{CreationObjectID}/1;
my $cinema = $session->{PlaceObjectID}/1;
my $format = (reftype $session->{Format} ne reftype '' ? '' : $session->{Format});

my $hall = (reftype $session->{HallName} ne reftype '' ? '' : $session->{HallName});
$hall =~ s/\"/\\\"/g;

my $minprice = (reftype $session->{MinPrice} ne reftype 1 ? 0 : $session->{MinPrice});
my $maxprice = (reftype $session->{MaxPrice} ne reftype 1 ? $minprice : $session->{MaxPrice});

my $date = $session->{DateTime};
next if ($date !~ /^\d{4}\-\d{2}\-\d{2} \d{2}\:\d{2}$/);
my $time = $date;
$date =~ s/^(\d{4}\-\d{2}\-\d{2}) (\d{2}\:\d{2})$/$1/;
$time =~ s/^(\d{4}\-\d{2}\-\d{2}) (\d{2}\:\d{2})$/$2/;

$shows .= <<EOF;
{"id":$id,"cinema":$cinema,"film":$film,"date":"$date","time":"$time","format":"$format","hall":"$hall","min":$minprice,"max":$maxprice},
EOF

#print "$cinema $film $date OK\n";
};
};

Encode::_utf8_off($shows);
$shows =~ s/\,\s*$//s;

print JSON <<EOF;
$shows
]
}
EOF
close JSON;

`/bin/mv rambler.json.tmp rambler.json`;
`/bin/tar -cpPzf rambler.tar.gz rambler.json`;

exit(0);

my @data;
my $err = &dataselect("SELECT id,filmid,title,url,anons from afisha order by pos desc", \@data, \$connected, \$dbh);

foreach my $j (@data)
{

}

my @data2;
$err = &dataselect("SELECT id,afishaid,title,phone,address,metro,info,city,visible from cinemas where title <> ''", \@data2, \$connected, \$dbh);

foreach my $j (@data2)
{

}

my $time_off = time();
my $t1 = [(time, times, 0)];
my $td = timestr(timediff($t1, $t0));

print "the code took: ",($time_off - $time_on),' ',$td,"\n";

$dbh->disconnect if ($connected);

exit(0);

sub wget_url
{
my $file = shift;
my $url = shift;

#         my $ua = new LWP::UserAgent;
#         $ua->agent("Mozilla/3.01 (compatible;) " . $ua->agent);
#         $ua->timeout(120);

         # Create a request
#         my $req = new HTTP::Request GET => $url;

         # Pass request to the user agent and get a response back
#         my $res = $ua->request($req);

         # Check the outcome of the response
#         if ($res->is_success) {
#             print "OK - $url\n";
#open(FILE,">$file");
#print FILE $res->content;
#close FILE;
#         } else {
#             print "error - $url\n";
#         }

if ($file =~ /\//) {
  my $dir = $file;
  $dir =~ s/\/[^\/]*$/\//;
  `/bin/mkdir -p $dir`;
}

`/usr/local/bin/wget -O $file $url`;

}
