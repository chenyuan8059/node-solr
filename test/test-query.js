var common = require('./common');
var assert = common.assert;
var solr = common.solr;

var client = common.createClient();

client.del(null, '*:*', function (err) {  // Clean up index
  if (err) throw err;
  var doc = {
    id: "1",
    fizzbuzz_t: "foo",
    wakak_i: "5",
    bar_t: "11:15 is 11:00 + 15 minutes"
  };
  client.add(doc, function (err) {
    if (err) throw err;
    client.commit(function (err) {
      if (err) throw err;
      var query = "wakak_i:5";
      client.query(query, function (err, res) {
        assert.equal(JSON.parse(res).response.numFound, 1);
      });
      var queryParams = "q=fizzbuzz_t:foo"
      client.rawQuery(queryParams, function (err, res) {
        assert.equal(solr.getStatus(res), 0);
      });
      var query = "bob:poodle";
      client.query(query, function (err) {
        assert.equal(err.message, "undefined field bob");
      });
      var query = "bar_t:11:15";
      client.query(query, function (err) {
        assert.ok(err, 'Unescaped query did not error');
      });
      var query = "bar_t:" + solr.valueEscape("11:00 + 15");
      client.query(query, function (err, res) {
        assert.equal(JSON.parse(res).response.numFound, 1);
      });
    });
  });
});

