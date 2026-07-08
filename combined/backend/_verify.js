try {
  require('./src/services/nutrition/breed-nutrition-adapter');
  console.log('✅ breed-nutrition-adapter');
  require('./src/services/nutrition/health-risk-engine');
  console.log('✅ health-risk-engine');
  require('./src/services/nutrition/bcs.service');
  console.log('✅ bcs.service');
  require('./src/services/nutrition/macronutrient.service');
  console.log('✅ macronutrient.service');
  require('./src/services/nutrition/feeding-schedule.service');
  console.log('✅ feeding-schedule.service');
  require('./src/utils/calculateCalories');
  console.log('✅ calculateCalories');
  require('./src/validations/nutrition.validation');
  console.log('✅ nutrition.validation');
  require('./src/prompts/nutrition/nutrition.prompt');
  console.log('✅ nutrition.prompt');
  require('./src/services/nutrition/nutrition-engine.service');
  console.log('✅ nutrition-engine.service');
  console.log('\nALL MODULES LOADED SUCCESSFULLY');
} catch (e) {
  console.error('LOAD ERROR:', e.message);
  process.exit(1);
}
