if [[ ! $(heroku apps:info -a staging-pariteaupouvoir) ]]; then
  git init
  heroku create --app staging-pariteaupouvoir --buildpack heroku/nodejs --remote staging
  heroku config:set --app staging-pariteaupouvoir TYPE=staging
  if [[ ! -d "./scripts/staging_secret.sh" ]]; then
    source ./scripts/staging_secret.sh
  fi
else
  echo "staging-pariteaupouvoir has been already created"
fi
