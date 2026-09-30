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
          {
            id: 3452465,
            name: 'Rio Claro',
            admin1: 'São Paulo',
            country: 'Brasil',
            latitude: -22.4114,
            longitude: -47.5613,
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
  await page.getByRole('button', { name: 'Selecionar São Paulo, Brasil' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo, Brasil' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão para 5 dias' })).toBeVisible();

  await page.getByRole('button', { name: 'Fahrenheit' }).click();

  await expect(
    page.getByRole('region', { name: 'São Paulo, Brasil' }).getByText('32,0 °F', { exact: true }),
  ).toBeVisible();
});

test('seleciona por teclado o resultado focado e mantém foco visível', async ({ page }) => {
  await mockSuccessfulWeather(page);
  await page.goto('/');

  const searchbox = page.getByRole('searchbox', { name: 'Cidade' });
  await searchbox.fill('São Paulo');
  await searchbox.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Foram encontradas 2 cidades.');

  const resultsHeading = page.getByRole('heading', { name: 'Cidades encontradas' });
  await expect(resultsHeading).toBeFocused();
  await expect(resultsHeading).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const secondResult = page.getByRole('button', {
    name: 'Selecionar Rio Claro, São Paulo, Brasil',
  });
  await expect(secondResult).toBeFocused();
  await expect(secondResult).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'Rio Claro, São Paulo, Brasil' })).toBeVisible();
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

test('posiciona a unidade ao lado da busca no desktop e abaixo no mobile', async ({ page }) => {
  await page.goto('/');

  for (const width of [1024, 375]) {
    await page.setViewportSize({ width, height: 812 });
    const search = await page.getByRole('search', { name: 'Buscar cidade' }).boundingBox();
    const unit = await page.getByRole('group', { name: 'Unidade de temperatura' }).boundingBox();

    expect(search).not.toBeNull();
    expect(unit).not.toBeNull();
    if (!search || !unit) throw new Error('Controles de busca e unidade não visíveis');

    if (width === 1024) {
      expect(unit.x).toBeGreaterThanOrEqual(search.x + search.width - 1);
    } else {
      expect(unit.y).toBeGreaterThanOrEqual(search.y + search.height - 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('renderiza o clima no fluxo principal em viewport mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockSuccessfulWeather(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: 'Selecionar São Paulo, Brasil' }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo, Brasil' })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'São Paulo, Brasil' }).getByText('0,0 °C', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão para 5 dias' })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(5);
});
