if [[ ! $(heroku apps:info -a parite-au-pouvoir) ]]; then
  git init
  heroku create --app parite-au-pouvoir --buildpack heroku/nodejs --remote production
  heroku config:set --app parite-au-pouvoir TYPE=production
else
  echo "toster has been already created"
  echo "Do you wish to delete this app (y/n)?"
  read answer
  if echo "$answer" | grep -iq "^y" ;then
    heroku apps:destroy parite-au-pouvoir --confirm parite-au-pouvoir;
    heroku create --app parite-au-pouvoir --buildpack heroku/nodejs --remote production;
    heroku config:set --app parite-au-pouvoir TYPE=production;
    # heroku domains:add www.parite-au-pouvoir.org
  else
    echo No
  fi
fi
