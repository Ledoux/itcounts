import React from 'react'

import Bubbles from '../components/Bubbles'
import Button from '../components/Button'
import Icon from '../components/Icon'
import PageSection from '../components/PageSection'
import Quote from '../components/Quote'
import SocialShares from '../components/SocialShares'

const HomePage = () => {
  return (
    <main className='home-page'>

      <PageSection
        extraClass='home-page__welcome-section center'
      >
        <Icon
          className='home-page__welcome-section__cloud'
          icon='cloud'
        />
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
        <Button
          className="button button--large home-page__welcome-section__cta"
          onClick={() => {
            document.querySelector(`section#bubbles`)
              .scrollIntoView({behavior: 'smooth'})
          }}
        >
          D&eacute;couvrir
        </Button>
        <div>
          <Icon
            className='home-page__welcome-section__buildings'
            icon='buildings'
          />
        </div>
      </PageSection>

      <PageSection
        extraClass='home-page__bubbles-section center'
        id='bubbles'
      >
        <p className="home-page__bubbles-section__title">
          D&eacute;couvrez la proportion de femmes &aacute; l&#39;Assembl&eacute;e Nationale
          selon leur:
        </p>
        <div className="mb2">
          <Bubbles />
        </div>
      </PageSection>

      <PageSection extraClass='home-page__participate-section center'>
        <p className="home-page__participate-section__title">
          Participer
        </p>
        <Quote className='quote home-page__participate-section__quote'>
          <div className='home-page__participate-section__quote__up p2'>
            <img
              className='home-page__participate-section__quote__up__img col col-4'
              src='/static/images/camembert.png'
            />
            <p className='home-page__participate-section__quote__up__text col col-8 p2'>
              R&eacute;patition du genre dans l&#39;Assembl&eacute;e Nationale
            </p>
          </div>
          <div className='home-page__participate-section__quote__down'>
            Signez votre p&eacute;tition pour plus de femmes &aacute; l&#39;Assembl&eacute;e Nationale.
            [URL]&#35;VEGA &#35;Parit&eacute; &#35;Politique http://vega-project.org/
          </div>
        </Quote>
        <SocialShares className="home-page__participate-section__social-shares"/>
        <p className="home-page__participate-section__subtitle mb3">
          Encouragez la representativit&eacute; des femmes dans les instances de
          pouvoir politiques et publiques : <a> signez notre p&eacute;titiion </a>
          pour avoir un impact &aacute; l&#39;Assembl&eacute;e Nationale !
        </p>
        <Button className="button button--large home-page__participate-section__cta">
          Signer la P&eacute;tition
        </Button>
      </PageSection>

      <PageSection
        extraClass='home-page__team-section center'
        id='equipe'
      >
        <p className="home-page__team-section__title mb1">
          Equipe
        </p>
        <div className='home-page__team-section__container'>
          {[
            [{
              image: "virginie_robidou.png",
              name: "Virginie Robidou",
              speciality: "Dévelopeuse"
            },
            {
              image: "agathe_brusset.png",
              name: "Agathe Brusset",
              speciality: "Coordinatrice du projet"
            },
            {
              image: "aude_bernheim.png",
              name: "Aude Bernheim",
              speciality: "Conseil externe"
            }],
            [{
              image: "erwan_ledoux.png",
              name: "Erwan Ledoux",
              speciality: "Dévelopeur"
            },
            {
              image: "sylvain_raibaud.png",
              name: "Sylvain Raibaud",
              speciality: "Spécialiste PNL"
            },
            {
              image: "adrien_bernheim.png",
              name: "Adrien Bernheim",
              speciality: "Graphiste"
            }],
            [{
              image: "cecile_baltazart.png",
              name: "Cécile Baltazart",
              speciality: "Designer UX"
            },
            {
              image: "nina_varchavsky.png",
              name: "Nina Varchavsky",
              speciality: "Cultivatrice d'idées"
            },
            {
              image: "mickael_bolnet.png",
              name: "Mickaël Bolnet",
              speciality: "Dévelopeur Full Stack"
            }],
            [{
              image: "baptiste_quentin.png",
              name: "Baptiste Quentin",
              speciality: "Coordinateur du projet"
            },
            {
              image:"louis_jean_de_gastines.png",
              name: "Louis-Jean de Gastines",
              speciality: "Coordinateur du projet"
            }]
          ].map((rows, rowIndex) => (<div
              className='home-page__team-section__container__rows mb2'
              key={rowIndex}
            >
            {
              rows.map(({image, name, speciality}, colIndex) => (<div
                className='home-page__team-section__container__rows__profile col col-4 p2'
                key={colIndex}>
                <img
                  className='home-page__team-section__container__rows__profile__img col col-4 p1'
                  src={`static/images/${image}`}
                />
                <div
                  className='home-page__team-section__container__rows__profile__text col col-8 p2'
                >
                  <div className='home-page__team-section__container__rows__profile__text__name mb2'>
                    {name}
                  </div>
                  <div className='home-page__team-section__container__rows__profile__text__speciality'>
                    {speciality}
                  </div>
                </div>
              </div>))
            }
          </div>))
        }
        </div>
      </PageSection>

      <PageSection
        extraClass='home-page__partners-section center'
        id='partenaires'
      >
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
