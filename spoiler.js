const readlineSync = require('readline-sync')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

let movieName
let time

function getMovie() {
    movieName = readlineSync.question('\nTell ya boy what movie you wanna know about... ')
    if (Number(movieName) || movieName == 0) {
        console.log('Bruh, I asked for a movie name.')
        return getMovie()
    }
    getTime()
    return movieName
}

function getTime() {
    const timeInput = readlineSync.question(
        '\nPass a digit so I can give you a heads up when I\'m \'bout to spoil the movie plot... ')
    time = Number(timeInput)
    if (!time) {
        console.log('Yo are ya dumb bud?')
        return getTime()
    }

    const apiKey = '072c606f5fdaf837b484c0991a077f94'
    const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`

    request(url2, function (error, response, body) {
        const content = JSON.parse(body)

        if (!content.results[0] || error) {
            console.log(`\nMy bad b, couldn\'t find anything on ${movieName}`)
            return getMovie()
        } else {
            console.log(`\n*** SPOILER ALERT ***\nFinna tell you the lowdown on ${movieName} in ${time}s`)

            const url1 = `https://www.google.ca/search?q=${movieName}+film`

            request(url1, function (error, response, body) {
                if (error) {
                    console.log(error)
                } else {
                    const $ = cheerio.load(body)

                    console.log(`\nBut bruuh check out all the shit Google had to say on the movie ${movieName}:`)
                    const titleArray = []
                    const title = $('h3').each(function (i, elem) {
                        titleArray[i] = $(this).text()
                        console.log(`\t${titleArray[i]}`)
                        return
                    })
                }

                let countdown = time * 1000
                const summary = content.results[0].overview

                setTimeout(function () {
                    console.log(`\nHere's wsup wid it doe: \n${summary}\n\nStraaaaaaaaight finessed you fam.\n`)
                }, countdown)

                return
            })
        }
    })
    return
}

getMovie()