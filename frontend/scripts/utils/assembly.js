import classnames from 'classnames'
import React from 'react'

import Icon from '../components/Icon'

const options = [
  {
    description: `Saviez-vous que les emplacements proches des micros et des caméras,
    ou bien le long des allées et en bas de l'Assemblée, vers les
    ministres ou les chefs de groupe, étaient particulièrement convoités ?
    Ces places donnent plus de chances aux député-e-s qui s'y trouvent d'être filmé-e-s
    le jour des questins au gouvernement.

    Les femmes ont-elles les mêmes chances que les hommes de s'y trouver ?`,
    infos: [{
      className: 'pastille--micro-blue',
      text: 'Micros'
    }, {
      className: 'pastille--dark-green',
      text: 'Sièges de haute "valeur" politique'
    }, {
      className: 'pastille--middle-green',
      text: 'Sièges de moyenne "valeur" politique'
    }, {
      className: 'pastille--light-green',
      text: 'Sièges de faible "valeur" politique'
    }, {
      className: 'pastille--middle-grey',
      text: 'Gouvernement'
    }].map(({className, text}, index) => {
      return (<div
          className='assembly__content__legend__row'
          key={index}
        >
          {
            text === 'Micros'
            ? <Icon className='assembly__content__legend__row__pastille col mr2'
              icon='micro_blue'/>
            : (<div
            className={classnames('assembly__content__legend__row__pastille col mr2', {
              [className]: true
            })}
            />)
          }
          <p className='assembly__content__legend__row__text col'>
            {text}
          </p>
      </div>)
    }),
    text: 'Meilleurs sieges',
    value: 'meilleurs_sieges',
    image: 'zones'
  },
  {
    description: `Alors que Les Républicains sont les plus mauvais
    élèves de la parité, le groupe politique des Socialistes,
    écologistes et républicains affiche un taux de 35% de femmes
    dans ses rangs !`,
    infos: [{
      className: 'pastille--middle-green',
      text: 'Parti Socialiste'
    }, {
      className: 'pastille--dark-green',
      text: 'Gauche Democrate Républicaine'
    }, {
      className: 'pastille--dark-blue',
      text: 'Les Républicains'
    }, {
      className: 'pastille--light-blue',
      text: 'Radical Républicain Démocrate & Progressiste'
    }, {
      className: 'pastille--orange',
      text: 'Non inscrits'
    }, {
      className: 'pastille--middle_blue',
      text: 'UDI'
    }].map(({className, text}, index) => {
      return (<div
          className='assembly__content__legend__row'
          key={index}
        >
          <div
          className={classnames('assembly__content__legend__row__pastille col mr2', {
            [className]: true
          })}
          />
          <p className='assembly__content__legend__row__text col'>
            {text}
          </p>
      </div>)
    }),
    text: 'Groupe politique',
    value: 'groupe_politique',
    image: 'partis'
  },
  {
    description: `On remarque que les attributions des
    député-e-s dans les commissions sont genrées : les
    députées sont plus nombreuses dans les commissions dites
    “non-régaliennes”, comme la commission aux affaires
    culturelles que dans les commissions régaliennes,
    comme celle de la finance`,
    infos: [{
      className: 'pastille--light-pink',
      text: 'Affaires Etrangères (régalienne)'
    }, {
      className: 'pastille--middle-pink',
      text: 'Finance (régalienne)'
    }, {
      className: 'pastille--dark-pink',
      text: 'Développement Durable'
    }, {
      className: 'pastille--light-green',
      text: 'Affaires Sociales'
    }, {
      className: 'pastille--middle-green',
      text: 'Culture'
    }, {
      className: 'pastille--dark-green',
      text: 'Loi'
    }, {
      className: 'pastille--dark-green',
      text: 'Economie'
    }].map(({className, text}, index) => {
      return (<div
          className='assembly__content__legend__row'
          key={index}
        >
          <div
          className={classnames('assembly__content__legend__row__pastille col mr2', {
            [className]: true
          })}
          />
          <p className='assembly__content__legend__row__text col'>
            {text}
          </p>
      </div>)
    }),
    text: 'Commission',
    value: 'commission',
    image: 'commissions'
  },
  {
    description: `Alors que la répartition femmes/hommes est
    presque égale à 1 mandat, on atteint 85% d’hommes cumulant 4 mandats.`,
    infos: [{
      className: 'pastille--light-blue',
      text: 'Député-e-s 1-2 mandat(s)'
    }, {
      className: 'pastille--dark-blue',
      text: 'Député-e-s 3-4 mandats'
    }].map(({className, text}, index) => {
      return (<div
          className='assembly__content__legend__row'
          key={index}
        >
          <div
          className={classnames('assembly__content__legend__row__pastille col mr2', {
            [className]: true
          })}
          />
          <p className='assembly__content__legend__row__text col'>
            {text}
          </p>
      </div>)
    }),
    text: 'Mandats cumulés',
    value: 'mandats_cumules',
    image: 'mandats'
  }
]
options.forEach((option, index) => {option.index = index})

export default options
