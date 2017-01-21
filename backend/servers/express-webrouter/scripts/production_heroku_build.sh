if [[ ! $(heroku apps:info -a toster) ]]; then
  git init
  heroku create --app itcounts --buildpack heroku/nodejs --remote production
  heroku config:set --app itcounts TYPE=production
else
  echo "toster has been already created"
  echo "Do you wish to delete this app (y/n)?"
  read answer
  if echo "$answer" | grep -iq "^y" ;then
    heroku apps:destroy itcounts --confirm itcounts;
    heroku create --app itcounts --buildpack heroku/nodejs --remote production;
    heroku config:set --app itcounts TYPE=production;
  else
    echo No
  fi
fi
