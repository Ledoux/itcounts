if [[ ! $(heroku apps:info -a staging-parite-au-pouvoir) ]]; then
  git init
  heroku create --app staging-parite-au-pouvoir --buildpack heroku/nodejs --remote staging
  heroku config:set --app staging-parite-au-pouvoir TYPE=staging
else
  echo "staging-parite-au-pouvoir has been already created"
  echo "Do you wish to delete this app (y/n)?"
  read answer
  if echo "$answer" | grep -iq "^y" ;then
    heroku apps:destroy staging-parite-au-pouvoir --confirm staging-parite-au-pouvoir;
    heroku create --app staging-parite-au-pouvoir --buildpack heroku/nodejs --remote staging;
    heroku config:set --app staging-parite-au-pouvoir TYPE=staging;
    # heroku domains:add www.staging-parite-au-pouvoir.org
  else
    echo No
  fi
fi
