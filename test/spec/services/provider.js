// 'use strict';

// describe('Service: ProvidersService', function () {

//   beforeEach(module('anyfetchFrontApp'));

//   var service;

//   beforeEach(inject(function (ProvidersService) {
//     service = ProvidersService;
//   }));

//   it('should contain the accessers', function () {
//     expect(angular.isFunction(service.set)).toBe(true);
//     expect(angular.isFunction(service.get)).toBe(true);
//     expect(angular.isFunction(service.updateSearchCounts)).toBe(true);
//   });

//   it('should set default search_count and visibility', function() {
//     var providerTest = {
//       1 : { name: 'google contact' },
//       2 : { name: 'gmail' }
//     };
//     service.set(providerTest);
//     angular.forEach(service.get(), function(dT){
//       expect(dT.visible).toBe(true);
//       expect(dT.search_count).toBe(0);
//     });
//   });
// });
