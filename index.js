/* global iimPlayCode, iimGetLastExtract, iimGetLastError, window, module*/

/**
 * A wrapper around iimPlayCode function that allows a user to terminate script execution
 * when pressing the STOP button.
 *
 * @param  {string} macro Macro to play in iMacros' language.
 * @param  {object} opts  Optional parameters object that includes:
 *                        errorIgnore {boolean} if true than iMacros won't stop on errors uccured
 *                        timeoutStep {integer} timeout to search for a TAG on a webpage before failing with error
 *                        successMsg {string} success message to log when macro done
 * @return {object}       Object with two properties:
 *                        code - execution code returned by iMacros' iimPlayCode() function
 *                        extract - extracted data if any;
 */
module.exports = function (macro, opts) { 'use strict';
	opts = opts || {};
	var errorIgnore = opts.errorIgnore ? 'YES' : 'NO' || 'NO';
	var timeoutStep = opts.timeoutStep || 5;
  var successMsg = opts.successMsg || undefined;

  macro = 'SET !REPLAYSPEED FAST' +
		'\nSET !ERRORIGNORE ' + errorIgnore +
		'\nSET !TIMEOUT_STEP ' + timeoutStep +
		'\n' + macro;

  var code = iimPlayCode(macro);

	switch (code) {
    case 1:
      if (successMsg) window.console.info(successMsg);
      break;
		case -101:
			var err = new Error('\nРабота скрипта прервана пользователем.\n');
			err.name = 'STOPSCRIPT';
			throw err;
		case -920:
		case -921:
		case -922:
		case -923:
		case -924:
		case -925:
		case -926:
			window.console.error('Элемент не найден на текущей странице.', iimGetLastError());
			break;
		case -1001:
			window.console.error('Ошибка при выполнении действия на странице.', iimGetLastError());
	}

	var extract = iimGetLastExtract().split('[EXTRACT]');

	return {
		'code': code,
		'extract': extract.length === 1 ? extract[0] : extract
	};
};
