import argparse
import connexion

from main import GIRest
from resolvers import FridaResolver

def main():
    parser = argparse.ArgumentParser(description="GIRest development server")
    parser.add_argument("--pid", type=int, required=True, help="Process ID to instrument")
    args = parser.parse_args()

    girest = GIRest("Gst", "1.0")
    spec = girest.generate()
    app = connexion.App(__name__)
    specd = spec.to_dict()
    resolver = FridaResolver(girest, args.pid)
    app.add_api(specd, resolver=resolver, name="main_api")
    app.run(port=9000)


if __name__ == "__main__":
    main()


