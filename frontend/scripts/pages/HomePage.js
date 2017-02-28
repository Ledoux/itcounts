import React from 'react'

import Bubbles from '../components/Bubbles'
import PageSection from '../components/PageSection'

import Button from '../components/Button'
import Icon from '../components/Icon'
import Quote from '../components/Quote'
import SocialShares from '../components/SocialShares'

const HomePage = () => {
  return (
    <main className='home-page'>

      <PageSection extraClass='home-page__welcome-section center'>
        <Icon
          className='home-page__welcome-section__assembly mb2'
          icon='big-assembly'
        />
        <p className="home-page__welcome-section__title mb1">
          26,9% de femmes à l&#39;Assembl&eacute;e, <br/ >
          51,5% de femmes en France.
        </p>
        <p className="home-page__welcome-section__subtitle">
          Visualiser pour mieux comprendre: Parit&eacute; au Pouvoir a pour mission
          de soutenir <br /> l&#39;&#35;&Eacute;galiteFemmeHomme, en analysant la parit&eacute;
          l&#39;Assembl&eacute;e Nationale
        </p>
        <Button className="button button--large home-page__welcome-section__cta">
          D&eacute;couvrir
        </Button>
        <div>
          <Icon
            className='home-page__welcome-section__buildings'
            icon='buildings'
          />
        </div>
      </PageSection>

      <PageSection extraClass='home-page__bubbles-section center'>
        <p className="home-page__bubbles-section__title mb2">
          D&eacute;couvrez la proportion de femmes &aacute; l&#39;Assembl&eacute;e Nationale
          selon leur:
        </p>
        <Bubbles />
        <Quote />
        <SocialShares />
      </PageSection>

      <PageSection extraClass='home-page__participate-section center'>
        <p className="home-page__participate-section__title mb1">
          Participer
        </p>
        <Quote />
        <SocialShares />
        <p className="home-page__participate-section__subtitle mb1">
          Encouragez la representativit&eacute; des femmes dans les instances de
          pouvoir politiques et publiques : <a> signez notre p&eacute;titiion </a>
          pour avoir un impact &aacute; l&#39;Assembl&eacute;e Nationale !
        </p>
        <Button className="button button--large home-page__participate-section__cta mb3">
          Signer la P&eacute;tition
        </Button>
      </PageSection>

      <PageSection extraClass='home-page__team-section center'>
        <p className="home-page__team-section__title mb1">
          Equipe
        </p>

      </PageSection>

      <PageSection extraClass='home-page__partners-section center'>
        <p className="home-page__partners-section__title mb1">
          Partenaires
        </p>
        <div className="home-page__partners-section__container">
          <div className="home-page__partners-section__container__partner col col-6 p2">
            <img
              className='home-page__partners-section__container__partner__img mb2'
              src='/static/images/data_for_good.png'
            />
            <p className="home-page__partners-section__container__partner__title mb2">
              Data For Good
            </p>
            <p className="home-page__partners-section__container__partner__subtitle">
              Data For Good est une association qui
              a pour mission d&#39;acc&eacute;l&eacute;rer
              les d&eacute;marches citoyennes et d&#39;utiliser
              les m&eacute;gadonn&eacute;es au service du bien.
            </p>
          </div>
          <div className="home-page__partners-section__container__partner col col-6 p2">
            <img
              className='home-page__partners-section__container__partner__img mb2'
              src='/static/images/wax.png'
              style={{width: '209px'}}
            />
            <p className="home-page__partners-section__container__partner__title mb2">
              WAX
            </p>
            <p className="home-page__partners-section__container__partner__subtitle">
              WAX Science est une association &acute; but non lucratif
              qui promeut une science ludique, ouverte et sans st&eacute;r&eacute;otypes.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection extraClass='home-page__find-section center'>
        <p className="home-page__find-section__title mb3">
          Retrouvez-nous
        </p>
        <div className="home-page__find-section__container">
          <Icon
            className='home-page__find-section__container__icon mr3'
            icon='facebook'
          />
          <Icon
            className='home-page__find-section__container__icon'
            icon='twitter'
          />
        </div>
      </PageSection>

      <PageSection extraClass='home-page__footer-section center p2'>
        <p className='home-page__footer-section__links'>
          Contact - Copyright - Mentions l&eacute;gales
        </p>
      </PageSection>

    </main>
  )
}

export default HomePage
