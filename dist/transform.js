"use strict";
var acorn = require("acorn");
var babel = require("@babel/core");
var log4js = require("log4js");
var log;
var walk;
var isEs6 = function (ast) {
    var es6NodeFound = false;
    if (ast.body) {
        var visitNode = function (node, state, c) {
            if (!es6NodeFound) {
                walk.base[node.type](node, state, c);
                switch (node.type) {
                    case "ArrowFunctionExpression":
                    case "ClassDeclaration":
                    case "ExportAllDeclaration":
                    case "ExportDefaultDeclaration":
                    case "ExportNamedDeclaration":
                    case "ImportDeclaration":
                        es6NodeFound = true;
                        break;
                    case "VariableDeclaration":
                        var variableDeclaration = node;
                        if (variableDeclaration.kind === "const" || variableDeclaration.kind === "let") {
                            es6NodeFound = true;
                            break;
                        }
                    default:
                }
            }
        };
        walk.recursive(ast, null, {
            Expression: visitNode,
            Statement: visitNode
        });
    }
    return es6NodeFound;
};
var configure = function (options) {
    options = options || {};
    if (!options.presets || options.presets.length === 0) {
        options.presets = [["env"]];
    }
    var transform = function (context, callback) {
        if (!context.js) {
            return callback(undefined, false);
        }
        if (isEs6(context.js.ast)) {
            options.filename = context.filename;
            log.debug("Transforming %s", options.filename);
            try {
                context.source = babel.transform(context.source, options).code;
                context.js.ast = acorn.parse(context.source, { sourceType: "module" });
                return callback(undefined, true);
            }
            catch (error) {
                return callback(error, false);
            }
        }
        else {
            return callback(undefined, false);
        }
    };
    var initialize = function (logOptions) {
        log4js.setGlobalLogLevel(logOptions.level);
        log4js.configure({ appenders: logOptions.appenders });
        log = log4js.getLogger("es6-transform.karma-typescript");
        walk = require("acorn/dist/walk");
    };
    return Object.assign(transform, { initialize: initialize });
};
module.exports = configure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNkJBQStCO0FBQy9CLG1DQUFxQztBQUVyQywrQkFBaUM7QUFJakMsSUFBSSxHQUFrQixDQUFDO0FBQ3ZCLElBQUksSUFBUyxDQUFDO0FBRWQsSUFBTSxLQUFLLEdBQUcsVUFBQyxHQUFtQjtJQUM5QixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO1FBQ1YsSUFBTSxTQUFTLEdBQUcsVUFBQyxJQUFTLEVBQUUsS0FBVSxFQUFFLENBQU07WUFDNUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ2YsS0FBSyx5QkFBeUIsQ0FBQztvQkFDL0IsS0FBSyxrQkFBa0IsQ0FBQztvQkFDeEIsS0FBSyxzQkFBc0IsQ0FBQztvQkFDNUIsS0FBSywwQkFBMEIsQ0FBQztvQkFDaEMsS0FBSyx3QkFBd0IsQ0FBQztvQkFDOUIsS0FBSyxtQkFBbUI7d0JBQ3BCLFlBQVksR0FBRyxJQUFJLENBQUM7d0JBQ3BCLE1BQU07b0JBQ1YsS0FBSyxxQkFBcUI7d0JBQ3RCLElBQU0sbUJBQW1CLEdBQUksSUFBbUMsQ0FBQzt3QkFDakUsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEtBQUssT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7NEJBQzVFLFlBQVksR0FBRyxJQUFJLENBQUM7NEJBQ3BCLE1BQU07eUJBQ1Q7b0JBQ0wsUUFBUTtpQkFDWDthQUNKO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO1lBQ3RCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFNBQVMsRUFBRSxTQUFTO1NBQ3ZCLENBQUMsQ0FBQztLQUNOO0lBQ0QsT0FBTyxZQUFZLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUYsSUFBTSxTQUFTLEdBQUcsVUFBQyxPQUFnQztJQUUvQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUV4QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDbEQsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUMvQjtJQUVELElBQU0sU0FBUyxHQUFpQixVQUFDLE9BQTRCLEVBQUUsUUFBOEI7UUFFekYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7WUFDYixPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckM7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBRXZCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNwQyxHQUFHLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUvQyxJQUFJO2dCQUNBLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDL0QsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZFLE9BQU8sUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNwQztZQUNELE9BQU8sS0FBSyxFQUFFO2dCQUNWLE9BQU8sUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNqQztTQUNKO2FBQ0k7WUFDRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckM7SUFDTCxDQUFDLENBQUM7SUFFRixJQUFNLFVBQVUsR0FBMkIsVUFBQyxVQUE0QztRQUNwRixNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDdEQsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUN6RCxJQUFJLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLFVBQVUsWUFBQSxFQUFFLENBQUMsQ0FBQztBQUNwRCxDQUFDLENBQUM7QUFFRixpQkFBUyxTQUFTLENBQUMifQ==