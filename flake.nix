{
  description = "Discord Bot Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.pnpm
            nodePackages.nodemon
          ];

          shellHook = ''
            export DISABLE_ESLINT_PLUGIN=true
            export PATH="$PWD/node_modules/.bin:$PATH"
            export NODE_ENV=development
            export NPM_CONFIG_PREFIX=$PWD/.npm-global
            export npm_config_cache=$PWD/.npm-cache
          '';
        };
      }
    );
}
