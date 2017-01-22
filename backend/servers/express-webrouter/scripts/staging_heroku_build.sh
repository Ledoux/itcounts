if [[ ! $(heroku apps:info -a staging-itcounts) ]]; then
  git init
  heroku create --app staging-itcounts --buildpack heroku/nodejs --remote staging
  heroku config:set --app staging-itcounts TYPE=staging
else
  echo "staging-itcounts has been already created"
  echo "Do you wish to delete this app (y/n)?"
  read answer
  if echo "$answer" | grep -iq "^y" ;then
    heroku apps:destroy staging-itcounts --confirm staging-itcounts;
    heroku create --app staging-itcounts --buildpack heroku/nodejs --remote staging;
    heroku config:set --app staging-itcounts TYPE=staging;
  else
    echo No
  fi
fi
