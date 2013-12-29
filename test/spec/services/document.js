'use strict';

describe('Service: DocumentTypesService', function () {

  beforeEach(module('anyfetchFrontApp'));

  var service;

  beforeEach(inject(function (DocumentTypesService) {
    service = DocumentTypesService;
  }));

  it('should contain the accessers', function () {
    expect(angular.isFunction(service.set)).toBe(true);
    expect(angular.isFunction(service.get)).toBe(true);
    expect(angular.isFunction(service.updateSearchCounts)).toBe(true);
  });

  it('should set default search_count and visibility', function() {
    var testDT = {
      1 : { name: 'contact' },
      2 : { name: 'file' }
    };
    service.set(testDT);
    angular.forEach(service.get(), function(dT){
      expect(dT.visible).toBe(true);
      expect(dT.search_count).toBe(0);
    });
  });
});
