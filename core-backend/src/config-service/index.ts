import * as AWS from "aws-sdk";

export default class ConfigService
  implements core.backend.config.IConfigService {
  private ssm: AWS.SSM;
  constructor(private logger: core.backend.Logger, region?: "ap-southeast-2") {
    if (region) {
      AWS.config.update({ region: "ap-southeast-2" });
    }
    this.ssm = new AWS.SSM();
  }

  public get = async <T>(
    sensitiveConfigKeys: core.backend.config.SensitiveConfigKey[]
  ) => {
    const nonSensitiveKeys: core.backend.config.NonSensitiveConfigKey[] = [
      "environment",
      "mysql_host",
      "mysql_port",
      "mysql_application_user_username",
      "mysql_database_name",
      "web_sockets_dynamo_table_name",
      "web_sockets_endpoint",
    ];
    const allKeys: core.backend.config.ConfigKey[] = [
      ...sensitiveConfigKeys,
      ...nonSensitiveKeys,
    ];
    this.logger.debug("Fetching config params");
    const paramsResult = await this.ssm
      .getParameters({
        Names: allKeys,
        WithDecryption: true,
      })
      .promise();

    const parameters = paramsResult.Parameters || [];

    const fetchedParams = allKeys.reduce(
      (builder: {}, key: core.backend.config.ConfigKey) => {
        const param = parameters.find((p) => p.Name === key);
        if (!param) {
          const error = new Error(
            `'${key}' could not be retrieved from Param Store`
          );
          this.logger.error(`Failed to fetch config`, error);
          throw error;
        }

        return {
          ...builder,
          [key]: param.Value,
        };
      },
      {}
    ) as { [key in core.backend.config.ConfigKey]: any };

    const config: core.backend.config.Config = {
      environment: fetchedParams.environment,
      aws: {
        region: fetchedParams.region,
        accountId: "todo",
      },
      mysql: {
        host: fetchedParams.mysql_host,
        port: Number(fetchedParams.mysql_port),
        user: fetchedParams.mysql_application_user_username,
        password: fetchedParams.mysql_application_user_password,
        database: fetchedParams.mysql_database_name,
        connectionLimit: 10,
      },
      jwt: {
        secret: fetchedParams.jwt_secret,
        validForInHours: 24 * 7,
      },
      // bucketNames: {
      //   profilePictures: this.getBucketNameFromDomain(
      //     fetchedParams.profile_pictures_s3_bucket_domain
      //   ),
      // },
      websockets: {
        dynamoTableName: fetchedParams.web_sockets_dynamo_table_name,
        endpoint: this.getWebsocketHttpInvokeEndpointFromWSSDomain(
          fetchedParams.web_sockets_endpoint || ""
        ),
      },
    };

    this.logger.debug("Successfully fetched config");
    return (config as unknown) as T;
  };

  // private getBucketNameFromDomain = (domain: string) => {
  //   return domain.split(".")[0];
  // };

  private getWebsocketHttpInvokeEndpointFromWSSDomain = (wssDomain: string) => {
    const parts = wssDomain.split(":");
    return `https:${parts[1]}`;
  };
}
