import { expect, type Page, test } from '@playwright/test';

async function mockSuccessfulWeather(page: Page) {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      json: {
        results: [
          {
            id: 3448433,
            name: 'São Paulo',
            admin1: 'São Paulo',
            country: 'Brasil',
            latitude: -23.5505,
            longitude: -46.6333,
          },
        ],
      },
    });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({
      json: {
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2026-09-30T14:00',
          temperature_2m: 0,
          apparent_temperature: 8.5,
          relative_humidity_2m: 62,
          weather_code: 0,
          wind_speed_10m: 11.5,
        },
        daily: {
          time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
          weather_code: [0, 1, 2, 3, 61],
          temperature_2m_min: [0, 1, 2, 3, 4],
          temperature_2m_max: [10, 11, 12, 13, 14],
          precipitation_probability_max: [0, 10, 20, 30, 40],
        },
      },
    });
  });
}

test('busca uma cidade, mostra a previsão e converte a temperatura para Fahrenheit', async ({
  page,
}) => {
  await mockSuccessfulWeather(page);
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo, Brasil' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão para 5 dias' })).toBeVisible();

  await page.getByRole('button', { name: 'Fahrenheit' }).click();

  await expect(page.getByText('32,0 °F', { exact: true })).toBeVisible();
});

test('mostra o estado vazio quando o geocoding não retorna results', async ({ page }) => {
  let forecastRequested = false;

  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({ json: {} });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequested = true;
    await route.fulfill({ json: {} });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Recife');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada.' })).toBeVisible();
  expect(forecastRequested).toBe(false);
});

test('renderiza o clima no fluxo principal em viewport mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockSuccessfulWeather(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo, Brasil' })).toBeVisible();
  await expect(page.getByText('0,0 °C', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão para 5 dias' })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(5);
});
