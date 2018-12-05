export const getHumanReadableShedule = store => {
  var res = []
  Object.keys(store)
    .reduce( (acc,day,index) => {
      let lust = index === Object.keys(store).length-1
      if(!acc){
        if(lust){
          let muchTimes = ''
          store[day].map((key) => {
            muchTimes = muchTimes.concat(key.from +' - '+ key.to + ',   ')
          })
          let time = `${day}: ${muchTimes}`
          let newTime = time.substring(0, time.length-4);
          res.push(newTime)
          return 'lust' 
        }
        return [store[day],day];
      }else{
        if(store[day].length > 1 || acc[0].length > 1){
          if(acc[0].length > 1 && store[day].length > 1 && store[day].length === acc[0].length){
            let days = store[day].every( (item,index) => {
              return item.from === acc[0][index].from && item.to === acc[0][index].to 
            } )
            if(days){
              if(lust){
                let muchTimes = ''
                acc[0].map((key) => {
                muchTimes = muchTimes.concat(key.from +' - '+ key.to + ',   ')
              })
                let time = `${acc[1]}-${day}: ${muchTimes}`
                let newTime = time.substring(0, time.length-4);
                res.push(newTime)
                return 'lust'
              }
              return [ ...acc, day ]
            }else{
              let muchTimes = ''
              acc[0].map((key) => {
                muchTimes = muchTimes.concat(key.from +' - '+ key.to + ',   ')
              })
              let time = `${acc[1]}${acc[1] === acc[acc.length-1] ? '' : '-'+acc[acc.length-1]}: ${muchTimes}`
              let newTime = time.substring(0, time.length-4);
              res.push(newTime)
              if(lust){
                let muchTimes = ''
                store[day].map( (key) => {
                  muchTimes = muchTimes.concat(store[day][key].from +' - '+ store[day][key].to + ',   ')
                })
                let time = `${day}: ${muchTimes}`
                let newTime = time.substring(0, time.length-4);
                res.push(newTime)
                return 'lust' 
              }
              return [store[day],day]
            }
          }else{
            let muchTimes = ''
            acc[0].map((key) => {
              muchTimes = muchTimes.concat(key.from +' - '+ key.to + ',   ')
            })
            
            let time = `${acc[1]}${acc[1] === acc[acc.length-1] ? '' : '-'+acc[acc.length-1]}: ${muchTimes}`
            let newTime = time.substring(0, time.length-4);
            res.push(newTime)
            if(lust){
              let muchTimes = ''
              store[day].map((key) => {
                muchTimes = muchTimes.concat(key.from +' - '+ key.to + ',   ')
              })
              let lustTime = `${day}: ${muchTimes}`
              res.push(lustTime)
              return 'lust' 
            }
            return [store[day],day]
          }
        }else{
          if(store[day].length === 0){
            if(lust){
              let notWorking = 'NOT WORKING'
              res.push(notWorking)
              return 'lust'
            }
            let notWorking = 'NOT WORKING'
            let accNow = `${acc[1]}${acc[1] === acc[acc.length-1] ? '' : '-'+acc[acc.length-1]}: ${acc[0][0].from}  - ${acc[0][0].to}`
            res.push(accNow,notWorking)
            return 0
          }
          if(store[day][0].from === acc[0][0].from && store[day][0].to === acc[0][0].to){
            if(lust){
              let nowAcc = `${acc[1]}-${day}: ${acc[0][0].from}  - ${acc[0][0].to} `
              res.push(nowAcc)
              return 'lust'
            }
            return [...acc, day]
          }else{
            let time = `${acc[1]}${acc[1] === acc[acc.length-1] ? '' : '-'+acc[acc.length-1]}: ${acc[0][0].from}  - ${acc[0][0].to} `
            res.push(time)
            if(lust){
              let lustTime = `${day}: ${store[day][0].from}  - ${store[day][0].to} `
              res.push(lustTime)
              return 'lust' 
            }
            return [store[day],day]
          }
        }
      }
    },0)
  return res
}

 export const isInWorkingHours = (store, sorter, storeTimeZone) => {
    const day = new Date(storeTimeZone).getDay()
    const getCurrentTime = `${(new Date(storeTimeZone).getHours() < 10 ? "0" : "") + new Date(storeTimeZone).getHours()}:${new Date(storeTimeZone).getMinutes()}`
    const storeDay = store[sorter[day-1]]
    const res = storeDay.some( (key) => {
        if( key.from < getCurrentTime && getCurrentTime < key.to ){
          return true 
        }
    })
    return res 
  }

export const diff = (start, end) => {
  start = start.split(":");
  end = end.split(":");
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = endDate.getTime() - startDate.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60);


  if (hours < 0)
      hours = hours + 24;

  return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}


export const getHumanReadableNextWorkingHours = (store, sorter,diff,storeTimeZone) => {
  const day = new Date(storeTimeZone).getDay()
  const getCurrentTime = `${(new Date(storeTimeZone).getHours() < 10 ? "0" : "") + new Date(storeTimeZone).getHours()}:${new Date(storeTimeZone).getMinutes()}`
  const storeDay = store[sorter[day-1]]
  if(storeDay && storeDay.length){
    for( let i = 0; i <= storeDay.length-1; i++){
      let lust =  i === storeDay.length-1
      if(lust){
        if(storeDay[i].from < getCurrentTime && getCurrentTime < storeDay[i].to ){
          return 'store is Available'
        }
         if(getCurrentTime < storeDay[i].from){
          return 'store will be Available after you wait:'+ diff(getCurrentTime,storeDay[i].from)
        }
        if( getCurrentTime > storeDay[i].to ){
          for( let i = day; i < sorter.length; i++ ){
            let lust =  i === sorter.length-1
            if(store[sorter[i]] && store[sorter[i]].length){
                return  'store will be open in '+ sorter[i] + ' at '+ store[sorter[i]][0].from
            }else{
              if(lust){
                for(let i = 0; i< sorter.length-1; i++){
                  if(store[sorter[i]]){
                      return 'store will be open in '+ sorter[i] + ' at '+ store[sorter[i]][0].from
                  }
                }
              }
            }
          }
        }
      }
      if( storeDay[i].to <  getCurrentTime && getCurrentTime < storeDay[i+1].from  ){
      return 'store will be Available after you wait:'+ diff(getCurrentTime,storeDay[i+1].from) 
      }
      if(storeDay[i].from < getCurrentTime && getCurrentTime < storeDay[i].to ){
        return 'store is Available'
      }
      if(getCurrentTime < storeDay[i].from){
        return 'store will be Available after you wait:'+ diff(getCurrentTime,storeDay[i].from)
      }
    }
  }else{
    for( let i = day; i <= sorter.length; i++ ){
      let lust =  i === sorter.length
      if(store[sorter[i]] && store[sorter[i]].length){
          return 'store will tomorrow at '+ store[sorter[i]][0].from 
      }else{
        if(lust){
           for(let i = 0; i< sorter.length-1; i++){
             if(store[sorter[i]]){
                return 'store will be open in  '+ sorter[i] + ' at '+ store[sorter[i]][0].from
             }
           }
        }
      }
    }
  }
}