if [[ ! $(heroku apps:info -a pariteaupouvoir) ]]; then
  git init
  heroku create --app pariteaupouvoir --buildpack heroku/nodejs --remote production
  heroku config:set --app pariteaupouvoir TYPE=production
else
  echo "pariteaupouvoir has been already created"
  echo "Do you wish to delete this app (y/n)?"
  read answer
  if echo "$answer" | grep -iq "^y" ;then
    heroku apps:destroy pariteaupouvoir --confirm pariteaupouvoir;
    heroku create --app pariteaupouvoir --buildpack heroku/nodejs --remote production;
    heroku config:set --app pariteaupouvoir TYPE=production;
    # heroku domains:add www.pariteaupouvoir.org
  else
    echo No
  fi
fi
