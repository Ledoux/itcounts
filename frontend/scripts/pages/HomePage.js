import React from 'react'

import Bubbles from '../components/Bubbles'
import PageSection from '../components/PageSection'

import Button from '../components/Button'
import Icon from '../components/Icon'

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

      <PageSection extraClass='home-page__bubbles-section'>
        <Bubbles />
      </PageSection>

      <PageSection extraClass='home-page__participate-section'>
        <div>
          Participer
        </div>
      </PageSection>

      <PageSection extraClass='home-page__team-section'>
        <div>
          Equipe
        </div>
      </PageSection>

      <PageSection extraClass='home-page__partner-section'>
        <div>
          Partenaires
        </div>
      </PageSection>

      <PageSection extraClass='home-page__footer-section'>
        <div>
          Footer
        </div>
      </PageSection>

    </main>
  )
}

export default HomePage
