let
  pkgs = import <nixpkgs> { };

  libraries = with pkgs;[
  ];

  packages = with pkgs; [
   nodejs_20
  ];
in
pkgs.mkShell {
  buildInputs = packages;
}
