let
  pkgs = import <nixpkgs> { };

  libraries = with pkgs;[
  ];

  packages = with pkgs; [
    nodejs_20
    nodePackages_latest.pnpm
  ];
in
pkgs.mkShell {
  buildInputs = packages;
}
