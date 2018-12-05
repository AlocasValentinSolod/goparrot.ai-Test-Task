import React, { Component, Fragment } from 'react'
import { store, store2, store3, store4, sorter, timeZones } from '../constants/index'
import { getHumanReadableShedule, isInWorkingHours, diff, getHumanReadableNextWorkingHours } from '../functions/index'

class App extends Component {
    constructor(){
        super()
        this.state={
            storeTime: null,
            storeNormalizedTime: null,
            storeAvailable: false,
            storeTimeShow: false,
            storeTimeZone: new Date().getTime(),
        }
    }

    componentDidMount () {
        // Maybe some fetches here
       this.setState({ storeTime:{ ...store3 } })
    }

    calculateStoreTime = e => {
        const { value } = e.target
        const timeOffset = new Date().getTimezoneOffset() * 60000
        const storeTimeOffset = value * 3600000 + timeOffset
        const storeTimeZone = new Date().getTime() + storeTimeOffset

        this.setState({ storeTimeZone })
    }

    showIFStoreAvailable = () => {
        const { storeTimeZone, storeTime } = this.state
        const storeNormalizedTime = getHumanReadableShedule(storeTime)
        const storeAvailable = isInWorkingHours(storeTime, sorter, storeTimeZone )
        const storeTimeShow = getHumanReadableNextWorkingHours(storeTime, sorter, diff, storeTimeZone )
        this.setState({storeAvailable, storeTimeShow, storeNormalizedTime})
    }

    render () {
        const { storeNormalizedTime, storeAvailable, storeTimeShow } = this.state
        return (
            <Fragment>
                <div>
                    <span>manage store location TimeZone</span>
                    <select onChange={ e => this.calculateStoreTime(e) }>
                        { timeZones ? Object.keys(timeZones).map( (key,index) => (
                                <option key={index} value={ timeZones[key] } >{key}</option>
                            )
                        ) : null }
                    </select>
                </div>
                <button onClick={ () => this.showIFStoreAvailable() } >Normileze StoreTime && show Store Time </button>
                <div>
                    {
                        storeNormalizedTime ? storeNormalizedTime.map( (days,index) => (<div key={index}> {days} </div>) ) : 'loading'
                    }
                </div>
                <div style={{ padding: '10px 0 10px 0' }}>
                    {
                        storeAvailable ? 'Store is working now? -- TRUE' : 'Store is working now? -- FALSE - it is closed'
                    }
                </div>
                <div>
                    {
                        storeTimeShow ? storeTimeShow : null
                    }
                </div>
                
            </Fragment>
        )
    };
}

export default App
