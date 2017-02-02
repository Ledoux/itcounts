
export async function getAsyncData (value) {
  let request =''
  switch(value){
    case 'region':
      request = '/api/dataviz_bubble/groupBy/region-nom';
      break
    case 'age':
      request = '/api/dataviz_bubble/age_range/5';
      break
    case 'commission_permanente':
      request = '/api/dataviz_bubble/groupBy/commission_permanente';
      break 
    case 'parti_politique':
    default:
      request = '/api/dataviz_bubble/groupBy/groupe-organisme';
      break
  }
  return window.fetch(request)
  .then(req => req.json())
  .then(json => {
    return json || {}
  })
}
