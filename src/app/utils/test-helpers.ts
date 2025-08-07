/// <reference types="jasmine" />
/**
 * Helpers pour les tests Angular
 * Centralise les mocks communs pour éviter les reloads intempestifs et les warnings polluants
 */

export interface WindowSpies {
  alert: jasmine.Spy;
  confirm: jasmine.Spy;
  prompt: jasmine.Spy;
  open: jasmine.Spy;
}

/**
 * Crée des spies pour tous les objets window en utilisant spyOn sur les méthodes existantes
 * @returns Les spies créés pour window
 */
export function createWindowSpies(): WindowSpies {
  const alertSpy = spyOn(window, 'alert').and.stub();
  const confirmSpy = spyOn(window, 'confirm').and.stub();
  const promptSpy = spyOn(window, 'prompt').and.stub();
  const openSpy = spyOn(window, 'open').and.stub();

  return {
    alert: alertSpy,
    confirm: confirmSpy,
    prompt: promptSpy,
    open: openSpy
  };
}

/**
 * Helper pour mocker console.warn et éviter la pollution des logs de test
 * @returns Le spy sur console.warn
 */
export function mockConsoleWarn(): jasmine.Spy {
  return spyOn(console, 'warn').and.stub();
}

/**
 * Helper pour mocker console.error et éviter la pollution des logs de test
 * @returns Le spy sur console.error
 */
export function mockConsoleError(): jasmine.Spy {
  return spyOn(console, 'error').and.stub();
}

/**
 * Helper pour mocker console.log et éviter la pollution des logs de test
 * @returns Le spy sur console.log
 */
export function mockConsoleLog(): jasmine.Spy {
  return spyOn(console, 'log').and.stub();
}

/**
 * Helper pour mocker console.info et éviter la pollution des logs de test
 * @returns Le spy sur console.info
 */
export function mockConsoleInfo(): jasmine.Spy {
  return spyOn(console, 'info').and.stub();
}

/**
 * Helper pour mocker tous les console methods
 * @returns Un objet avec tous les spies console
 */
export function mockAllConsoleMethods() {
  return {
    warn: mockConsoleWarn(),
    error: mockConsoleError(),
    log: mockConsoleLog(),
    info: mockConsoleInfo()
  };
}

/**
 * Helper pour vérifier qu'aucune alerte n'a été affichée
 * @param spies Les spies de window utilisés
 */
export function verifyNoAlertsShown(spies: WindowSpies): void {
  expect(spies.alert).not.toHaveBeenCalled();
  expect(spies.confirm).not.toHaveBeenCalled();
  expect(spies.prompt).not.toHaveBeenCalled();
}

/**
 * Helper pour vérifier qu'une alerte spécifique a été affichée
 * @param spies Les spies de window utilisés
 * @param expectedMessage Le message attendu
 */
export function verifyAlertShown(spies: WindowSpies, expectedMessage: string): void {
  expect(spies.alert).toHaveBeenCalledWith(expectedMessage);
}

/**
 * Helper pour vérifier qu'une confirmation spécifique a été demandée
 * @param spies Les spies de window utilisés
 * @param expectedMessage Le message attendu
 */
export function verifyConfirmShown(spies: WindowSpies, expectedMessage: string): void {
  expect(spies.confirm).toHaveBeenCalledWith(expectedMessage);
}

/**
 * Helper pour vérifier qu'un prompt spécifique a été affiché
 * @param spies Les spies de window utilisés
 * @param expectedMessage Le message attendu
 */
export function verifyPromptShown(spies: WindowSpies, expectedMessage: string): void {
  expect(spies.prompt).toHaveBeenCalledWith(expectedMessage);
}

/**
 * Helper pour vérifier qu'une fenêtre a été ouverte
 * @param spies Les spies de window utilisés
 * @param expectedUrl L'URL attendue (optionnel)
 */
export function verifyWindowOpened(spies: WindowSpies, expectedUrl?: string): void {
  if (expectedUrl) {
    expect(spies.open).toHaveBeenCalledWith(expectedUrl, jasmine.any(String), jasmine.any(String));
  } else {
    expect(spies.open).toHaveBeenCalled();
  }
}

/**
 * Helper générique pour vérifier qu'un console method a été appelé
 * @param consoleSpy Le spy sur la méthode console
 * @param expectedMessage Le message attendu (optionnel)
 */
function verifyConsoleMethodCalled(consoleSpy: jasmine.Spy, expectedMessage?: string): void {
  if (expectedMessage) {
    expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
  } else {
    expect(consoleSpy).toHaveBeenCalled();
  }
}

/**
 * Helper pour vérifier qu'un warning a été loggé
 * @param consoleSpy Le spy sur console.warn
 * @param expectedMessage Le message attendu (optionnel)
 */
export function verifyWarningLogged(consoleSpy: jasmine.Spy, expectedMessage?: string): void {
  verifyConsoleMethodCalled(consoleSpy, expectedMessage);
}

/**
 * Helper pour vérifier qu'une erreur a été loggée
 * @param consoleSpy Le spy sur console.error
 * @param expectedMessage Le message attendu (optionnel)
 */
export function verifyErrorLogged(consoleSpy: jasmine.Spy, expectedMessage?: string): void {
  verifyConsoleMethodCalled(consoleSpy, expectedMessage);
}

/**
 * Helper pour vérifier qu'un log a été affiché
 * @param consoleSpy Le spy sur console.log
 * @param expectedMessage Le message attendu (optionnel)
 */
export function verifyLogShown(consoleSpy: jasmine.Spy, expectedMessage?: string): void {
  verifyConsoleMethodCalled(consoleSpy, expectedMessage);
}

/**
 * Helper pour vérifier qu'une info a été loggée
 * @param consoleSpy Le spy sur console.info
 * @param expectedMessage Le message attendu (optionnel)
 */
export function verifyInfoLogged(consoleSpy: jasmine.Spy, expectedMessage?: string): void {
  verifyConsoleMethodCalled(consoleSpy, expectedMessage);
} 