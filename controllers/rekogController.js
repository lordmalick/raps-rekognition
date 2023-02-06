module.exports = function (app) {

	// load the AWS SDK
	var aws = require('aws-sdk')

	var fs = require('fs')

	
	var helper = require('./helpers')

	// load UI data model 
	var ui = require('../models/uiDataModel')

	var bodyParser = require('body-parser')
	app.use(bodyParser.json()) /
	app.use(
		bodyParser.urlencoded({
			extended: true
		})
	) 

	// load aws config
	aws.config.loadFromPath(__dirname + '/../config/aws-config-sample.json')

	var rekog = new aws.Rekognition({apiVersion: '2016-06-27'})

	app.get('/', function (req, res) {

		helper.resetUI()

		ui.flow.timestamp = new Date(Date.now())

		res.setHeader('Content-Type', 'text/html')
		res.render('./index.ejs', {
			ui: ui
		})

	})

	app.post('/rekog', function (req, res) {

		ui.data.filename = req.body.filename
		ui.flow.activateDiv = ui.flow.activateDiv || 'label-result-div'
		ui.flow.activateButton = ui.flow.activateButton || 'label-button'

		var loadImage = function () {
			return new Promise(function (resolve, reject) {

				var fs = require('fs')
				var file = __dirname + '/../images/' + req.body.filename

				if (ui.debuginfo) console.log('==> reading image from file ' + file)

				fs.readFile(file, 'base64', (err, data) => {

					if (err) reject(err)
					else {
						buffer = new Buffer(data, 'base64')
						resolve(buffer)
					}
				})
			})

		}

		var detectLabels = function (buffer) {
			return new Promise(function (resolve, reject) {

				var params = {
					Image: {
						Bytes: buffer
					},
					MaxLabels: 20,
					MinConfidence: 60
				}
				rekog.detectLabels(params, function (err, data) {
					if (err) reject(err)
					else {
						var str = ''
						if (ui.debuginfo) console.log('==> rekog label data is ', JSON.stringify(data, null, 3))

						for (i = 0; i < data.Labels.length; i++) {
							str += data.Labels[i].Name + ' - Confidence ' + data.Labels[i].Confidence.toFixed(2) + '%\n'
						}
						resolve(str)
					}
				})
			})


		}

		var detectText = function (buffer) {
			return new Promise(function (resolve, reject) {

				var params = {
					Image: {
						Bytes: buffer
					}
				}

				rekog.detectText(params, function (err, data) {

					if (err) reject(err)
					else {
						str = ''
						if (ui.debuginfo) console.log('==> rekog text result data is', JSON.stringify(data, null, 3))

						for (i = 0; i < data.TextDetections.length; i++) {
							str += '(' + data.TextDetections[i].Type + ') ' + data.TextDetections[i].DetectedText + ' - Confidence ' + data.TextDetections[i].Confidence.toFixed(2) + '%\n'
						}
						resolve(str)
					}
				})
			})
		}
		loadImage().then(function resolveLoadImage(buffer) {

				Promise.all([detectLabels(buffer)]).then(function resolveAll(arr) {
						ui.data.rekogResultLabel = arr[0]
						ui.data.rekogResultText = arr[1]
						ui.data.rekogResultFace = arr[2]
						res.render('./index.ejs', {
							ui: ui
						})

					},
					function rejectAll(err) {
						ui.data.rekogResultLabel = err
						res.render('./index.ejs', {
							ui: ui
						})
					})

			}, 
			function rejectLoadImage(err) {
				ui.data.rekogResultLabel = err
				res.render('./index.ejs', {
					ui: ui
				})
			})

	})
}