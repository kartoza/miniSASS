[this needs to be reformatted to github flavoured markdown]

== Installing miniSASS Django-CMS project ==

This is currently a basic Django-CMS site. No extra Django applications have been added yet. To install the pre-requisites
needed for this site to run, do the following:


Create a PostGreSQL database, based on a template that includes the PostGIS functionality.

'''
createdb -T <postgis-template> minisass-cms
'''

<postgis-template> is the name of your postgis-enabled database template.

or if you have postgresql >= 9.1 and PostGIS >= 2.0 then 

>createdb minisass-cms
>psql -c 'CREATE EXTENSION postgis;' minisass-cms



-- Create the project directory --

'''
mkdir miniSASS
cd miniSASS/
'''


-- Create the python virtual environment --

'''
virtualenv python
source python/bin/activate
'''
Install initial system-level dependencies

apt-get install python-dev libjpeg8-dev libpng12-dev libfreetype6-dev zlib1g-dev
 (or should that be libjpeg62-dev?)

If you still get this in the next step when compiling PIL:

    --------------------------------------------------------------------
    *** TKINTER support not available (Tcl/Tk 8.5 libraries needed)
    *** JPEG support not available
    *** ZLIB (PNG/ZIP) support not available
    *** FREETYPE2 support not available
    *** LITTLECMS support not available
    --------------------------------------------------------------------
    To add a missing option, make sure you have the required
    library, and set the corresponding ROOT variable in the
    setup.py script.

then try this or similar: http://www.jayzawrotny.com/blog/django-pil-and-libjpeg-on-ubuntu-1110 (untested)

-- Install the Django-CMS dependencies --

'''
pip install pil==1.1.7
pip install psycopg2
pip install Django==1.4
pip install django-cms
pip install south
pip install django-filer
pip install cmsplugin-filer
pip install django-reversion==1.6
'''


-- Checkout this repository from GitHub --

'''
git clone https://github.com/sokolic/miniSASS.git minisass
cd minisass/
'''

Now, copy settings.py.templ to settings.py, and set the database credentials correctly.

'''
cp minisass/settings.py.templ minisass/settings.py
'''

'''
vim settings.py

:wq
'''

-- Initialize your database and start the site --

'''
python manage.py syncdb --all
python manage.py migrate --fake
python manage.py runserver
'''

You should have an running, but empty, Django-CMS website.

Setting up the spatial data layers
==================================

Rivers
------

Download 'wriall500' from http://www.dwa.gov.za/iwqs/gis_data/river/rivs500k.html

> shp2pgsql -s 4326 -c -D -I -W LATIN1 wriall500 rivers | psql -d minisass-cms

Catchments
----------





