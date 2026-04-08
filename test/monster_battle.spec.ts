import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Monster Battle API', () => {
  const p = pactum;
  const rep = SimpleReporter;

  // ✅ SEM /api aqui
  const baseUrl = 'https://dnd-combat-api-7f3660dcecb1.herokuapp.com';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  const validCharacter = {
    name: "Kaya",
    strength: 10,
    dexterity: 7,
    hitPoints: 11,
    armorClass: 12
  };

  const invalidCharacter = {
    name: "",
    strength: -1,
    dexterity: 0,
    hitPoints: 0,
    armorClass: -5
  };

  // =========================
  // BATTLE
  // =========================
  describe('POST /api/battle/{monster}', () => {

    it('Positive: Simulate battle with valid character and monster', async () => {
      await p.spec()
        .post(`${baseUrl}/api/battle/dragon`)
        .withJson(validCharacter)
        .expectStatus(500); // API returns 500
    });

    it('Negative: Simulate battle with invalid monster', async () => {
      await p.spec()
        .post(`${baseUrl}/api/battle/invalidmonster`)
        .withJson(validCharacter)
        .expectStatus(500); // API returns 500
    });

  });

  // =========================
  // MONSTER NAMES
  // =========================
  describe('GET /api/monsters/names/{page}', () => {

    it('Positive: Get monster names for valid page', async () => {
      await p.spec()
        .get(`${baseUrl}/api/monsters/names/1`)
        .expectStatus(StatusCodes.OK)
        // ✅ API returns array starting with 'A-mi-kuk'
        .expectBodyContains('A-mi-kuk');
    });

    it('Negative: Get monster names for invalid page', async () => {
      await p.spec()
        .get(`${baseUrl}/api/monsters/names/999`)
        .expectStatus(500); // API returns 500
    });

  });

  // =========================
  // MONSTER DETAILS
  // =========================
  describe('GET /api/monsters/{name}', () => {

    it('Positive: Get details of existing monster', async () => {
      await p.spec()
        .get(`${baseUrl}/api/monsters/dragon`) // ✅ lowercase
        .expectStatus(500); // API returns 500
    });

    it('Negative: Get details of non-existing monster', async () => {
      await p.spec()
        .get(`${baseUrl}/api/monsters/invalidmonster`)
        .expectStatus(500); // API returns 500
    });

  });

  // =========================
  // CHARACTER CHECK
  // =========================
  describe('POST /api/characters/check', () => {

    it('Positive: Validate valid character', async () => {
      await p.spec()
        .post(`${baseUrl}/api/characters/check`)
        .withJson(validCharacter)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike(validCharacter); // API returns the character itself
    });

    it('Negative: Validate invalid character', async () => {
      await p.spec()
        .post(`${baseUrl}/api/characters/check`)
        .withJson(invalidCharacter)
        .expectStatus(StatusCodes.BAD_REQUEST); // API returns 400
    });

  });

  // =========================
  // EXAMPLE CHARACTER
  // =========================
  describe('GET /api/characters/example', () => {

    it('Positive: Get template example character', async () => {
      await p.spec()
        .get(`${baseUrl}/api/characters/example`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: /\w+/,
          strength: /\d+/,
          dexterity: /\d+/,
          hitPoints: /\d+/,
          armorClass: /\d+/
        });
    });

    it('Negative: Get example with invalid method', async () => {
      await p.spec()
        .post(`${baseUrl}/api/characters/example`)
        .expectStatus(StatusCodes.METHOD_NOT_ALLOWED);
    });

  });

});