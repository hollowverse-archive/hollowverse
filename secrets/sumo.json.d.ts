/**
 * A JSON file containing the [Colllector ID](https://help.sumologic.com/Start-Here/02Getting-Started/Glossary#section_2) used to instantiate a `SumoLogger` instance on the server, to send logs to [Sumo Logic](https://www.sumologic.com/).
 * The HTTP collector ID should be treated as a secret since it is publicly
 * accessible and anyone can send logs to the collector endpoint.
 */
type SumoSecret = {
  /**
   * The part of the collector URL after
   * https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/
   */
  collectorId: string;
};
