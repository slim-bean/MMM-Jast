import { Config } from '../types/Config'

// Global or injected variable declarations
declare const MM: any

export default class RainMapUtils {
  static supportedIconColors = ['black', 'blue', 'gold', 'green', 'grey', 'orange', 'red', 'violet', 'yellow']
  static rainConditions = [
    '09d',
    '09n',
    '10d',
    '10n',
    '11d',
    '11n',
    '13d',
    '13n',
    'showers',
    'thunderstorm',
    'sleet',
    'rain',
    'snow'
  ]

  static getIconColor(marker) {
    return marker.color && RainMapUtils.supportedIconColors.includes(marker.color) ? marker.color : 'red'
  }

  static sanitizeAndFilterFrames(results, config) {
    let historyFrames = results.radar?.past || []
    let forecastFrames = results.radar?.nowcast || []
    if (config.maxHistoryFrames >= 0 && historyFrames.length >= config.maxHistoryFrames) {
      try {
        historyFrames = historyFrames.slice(historyFrames.length - config.maxHistoryFrames)
      } catch (err) {
        console.warn('Error to limit history frames', err)
      }
    }

    if (config.maxForecastFrames >= 0 && forecastFrames.length >= config.maxForecastFrames) {
      try {
        forecastFrames = forecastFrames.slice(forecastFrames.length - config.maxForecastFrames)
      } catch (err) {
        console.warn('Error to limit forecast frames', err)
      }
    }

    return { historyFrames, forecastFrames }
  }

  static changeSubstituteModuleVisibility(show: boolean, config: Config) {
    if (config.substitudeModules) {
      try {
        for (const curr of config.substitudeModules) {
          const substituteModule = MM.getModules().find((module) => module.name === curr)
          if (!substituteModule) {
            console.warn(`No substitute module found with name ${curr}`)
            continue
          }
          if (show) {
            substituteModule.show(300)
          } else {
            substituteModule.hide(300)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
