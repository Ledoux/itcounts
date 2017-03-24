
const options = [
  {
    collideRadius: 3,
    maxSmRadius: 110,
    maxMdRadius: 150,
    maxMdFontSize: 30,
    description: `Le groupe Républicain comporte beaucoup moins de femmes (14%)
    que le groupe Socialiste (35%).`,
    text: 'Groupe Politique',
    value: 'parti_politique'
  },
  {
    maxSmFontSize: 15,
    maxMdFontSize: 20,
    description: `Il y a trois fois plus de députés femmes travaillant
    dans les “Affaires culturelles” que dans la “Finance”.`,
    text: 'Commission',
    value: 'commission_permanente'
  },
  {
    description: `La nouvelle Aquitaine atteint presque la parité pour
    ses députés alors que l'Ile de France en est loin (35%).`,
    text: 'Région',
    value: 'region'
  },
  {
    maxMdRadius: 120,
    description: `Après 70 ans, la proportion de députés femmes passe en dessous
      de la barre des 15%.`,
    text: 'Classe d\'âge',
    value: 'age'
  },
  {
    minSmFontSize: 20,
    minMdFontSize: 25,
    description: `15% des députés cumulant 4 mandats sont des femmes contre moins
      de 40% pour 1 mandat.`,
    text: 'Mandats cumulés',
    value: 'mandat'
  }
]
options.forEach((option, index) => {option.index = index})

export default options
