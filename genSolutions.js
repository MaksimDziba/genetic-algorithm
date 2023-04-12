// Параметры
const POPULATION_SIZE = 1000;
const MUTATION_RATE = 0.5;
const GENERATIONS = 1000;

const BUDGET = 500000;
const WORKSHOP_AREA = 10000;

const STANKS = [
  { name: "A", area: 20, cost: 1500, productivity: 50 },
  { name: "B", area: 15, cost: 1000, productivity: 40 },
];

// Создание начальной популяции случайных комбинаций
function createPopulation() {
  const population = [];

  for (let i = 0; i < POPULATION_SIZE; i++) {
    const chromosome = {
      A: Math.floor(Math.random() * (BUDGET / STANKS[0].cost)),
      B: Math.floor(Math.random() * (BUDGET / STANKS[1].cost)),
    };

    population.push(chromosome);
  }

  return population;
}

// Расчет приспособленности хромосомы
function calculateFitness(chromosome) {
  const totalCost =
    chromosome.A * STANKS[0].cost + chromosome.B * STANKS[1].cost;

  const totalArea =
    chromosome.A * STANKS[0].area + chromosome.B * STANKS[1].area;

  const totalProductivity =
    chromosome.A * STANKS[0].productivity +
    chromosome.B * STANKS[1].productivity;

  if (totalCost > BUDGET || totalArea > WORKSHOP_AREA) {
    return 0;
  }

  return totalProductivity;
}

// Селекция хромосом с помощью рулетки
function selection(population) {
  const totalFitness = population.reduce(
    (total, individual) => total + calculateFitness(individual),
    0
  );
  const selected = [];

  for (let i = 0; i < POPULATION_SIZE; i++) {
    let sum = 0;
    const randomValue = Math.random() * totalFitness;

    for (let j = 0; j < population.length; j++) {
      sum += calculateFitness(population[j]);

      if (sum >= randomValue) {
        selected.push(population[j]);
        break;
      }
    }
  }

  return selected;
}

// Смешивание генов двух родительских хромосом
function crossover(parent1, parent2) {
  const child = {
    A: 0,
    B: 0,
  };

  const crossoverPoint = Math.floor(
    Math.random() * Object.keys(parent1).length
  );

  let i = 0;

  for (let key in parent1) {
    if (i < crossoverPoint) {
      child[key] = parent1[key];
    } else {
      child[key] = parent2[key];
    }
    i++;
  }

  return child;
}

// Мутация генов
function mutation(chromosome) {
  for (let key in chromosome) {
    if (Math.random() < MUTATION_RATE) {
      chromosome[key] += Math.floor(Math.random() * 3) - 1;
    }
  }
  return chromosome;
}

// Эволюция популяции
function evolve(population) {
  const newPopulation = [];

  // Выбор лучших хромосом для следующего поколения
  const bestChromosome = population.reduce((a, b) =>
    calculateFitness(a) > calculateFitness(b) ? a : b
  );

  newPopulation.push(bestChromosome);

  // Генерация оставшейся части популяции
  while (newPopulation.length < POPULATION_SIZE) {
    const parent1 = selection(population)[0];
    const parent2 = selection(population)[0];

    const child = mutation(crossover(parent1, parent2));

    newPopulation.push(child);
  }

  return newPopulation;
}

// Основная функция
function main() {
  let population = createPopulation();

  console.time("Время теста");

  for (let i = 0; i < GENERATIONS; i++) {
    population = evolve(population);
  }

  const bestChromosome = population.reduce((a, b) =>
    calculateFitness(a) > calculateFitness(b) ? a : b
  );

  console.timeEnd("Время теста");

  console.log(
    `Оптимальная комбинация: A - ${bestChromosome.A}, B - ${bestChromosome.B}`
  );

  console.log(
    `Продуктивность станков: А - ${bestChromosome.A * STANKS[0].productivity}`
  );
  console.log(
    `Продуктивность станков: B - ${bestChromosome.B * STANKS[1].productivity}`
  );

  console.log(
    `Итоговая продуктивность: ${
      bestChromosome.A * STANKS[0].productivity +
      bestChromosome.B * STANKS[1].productivity
    }`
  );

  console.log(
    `Итоговая занимаемая площадь: ${
      bestChromosome.A * STANKS[0].area + bestChromosome.B * STANKS[1].area
    }`
  );
}

main();
